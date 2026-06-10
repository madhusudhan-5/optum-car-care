#!/bin/bash

# Exit on error
set -e

echo "==========================================================="
echo "Optum Car Care - VPS Deployment Script"
echo "==========================================================="

# Ask for domain
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "Domain cannot be empty!"
    exit 1
fi

# Ask for GitHub Token
read -p "Enter your GitHub Personal Access Token (for private repo clone): " GITHUB_TOKEN
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Token cannot be empty!"
    exit 1
fi

GITHUB_REPO="https://madhusudhan-5:${GITHUB_TOKEN}@github.com/madhusudhan-5/optum-car-care.git"
APP_DIR="/var/www/optum-car-care"

echo "Cleaning up old processes..."
sudo killall node || true
sudo killall gunicorn || true
pm2 delete all || true

echo "Updating system and installing dependencies..."
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git python3-venv python3-pip nginx certbot python3-certbot-nginx

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Installing PM2..."
sudo npm install -g pm2

echo "Setting up Application Directory..."
if [ -d "$APP_DIR" ]; then
    echo "Directory exists. Pulling latest code..."
    cd $APP_DIR
    git pull origin main
    git submodule update --init --recursive
else
    echo "Cloning repository..."
    sudo mkdir -p /var/www
    sudo chown $USER:$USER /var/www
    cd /var/www
    git clone $GITHUB_REPO optum-car-care
    cd optum-car-care
    git submodule update --init --recursive
fi

echo "Setting up Backend (Django)..."
cd $APP_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
python manage.py migrate
python manage.py collectstatic --noinput

echo "Configuring PM2 for Backend..."
# Create a wrapper script so PM2 executes it as Bash, not Node.js
cat << 'EOF' > $APP_DIR/backend/start_gunicorn.sh
#!/bin/bash
source venv/bin/activate
exec gunicorn --workers 3 --bind 127.0.0.1:8000 config.wsgi:application
EOF
chmod +x $APP_DIR/backend/start_gunicorn.sh

# Start Backend first so Next.js can fetch data during build
pm2 start $APP_DIR/backend/start_gunicorn.sh --name "optum-backend"

echo "Setting up Frontend (Next.js)..."
cd $APP_DIR/frontend
npm install
npm run build

echo "Configuring PM2 for Frontend..."
cd $APP_DIR
# Start Frontend
pm2 start npm --name "optum-frontend" --cwd $APP_DIR/frontend -- start

# Save PM2 state and configure startup
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER

echo "Configuring Nginx..."
NGINX_CONF="/etc/nginx/sites-available/optum-car-care"

sudo bash -c "cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Django Media
    location /media/ {
        alias $APP_DIR/backend/media/;
    }

    # Django Static
    location /static_django/ {
        alias $APP_DIR/backend/staticfiles/;
    }

    # Django API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }

    # Next.js Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
    }
}
EOF"

# Enable the site
sudo ln -sf /etc/nginx/sites-available/optum-car-care /etc/nginx/sites-enabled/
# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "Setting up SSL with Certbot..."
echo "This will install a free Let's Encrypt SSL certificate that auto-renews."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || echo "Certbot failed. You may need to manually configure it or check DNS propagation."

echo "==========================================================="
echo "Deployment Complete!"
echo "Your application should now be live at https://$DOMAIN"
echo "==========================================================="
