import os
import shutil
import django
import sys

# Setup Django environment
sys.path.append('/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from content.models import HomePageConfig
from services.models import Service
from django.core.files import File

extracted_dir = "/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/extracted_images"

# Get or create the main config
config = HomePageConfig.objects.first()
if not config:
    config = HomePageConfig.objects.create()

# We'll use the largest images from home_page for the main banners
home_images = [f for f in os.listdir(extracted_dir) if f.startswith('home_')]
# Sort by size to get the high quality ones for hero/banners
home_images.sort(key=lambda x: os.path.getsize(os.path.join(extracted_dir, x)), reverse=True)

if len(home_images) >= 5:
    # Open files and save to model
    def save_image(field, filename):
        path = os.path.join(extracted_dir, filename)
        with open(path, 'rb') as f:
            getattr(config, field).save(filename, File(f), save=False)

    save_image('hero_image', home_images[0])
    save_image('banner_image', home_images[1])
    save_image('standard_image', home_images[2])
    save_image('about_image_1', home_images[3])
    save_image('about_image_2', home_images[4])
    
    if len(home_images) >= 7:
        save_image('intro_image', home_images[5])
        save_image('contact_image', home_images[6])

config.save()
print("Populated HomePageConfig with extracted images.")

# Populate Service images
service_main_images = [f for f in os.listdir(extracted_dir) if f.startswith('service_main')]
service_detail_images = [f for f in os.listdir(extracted_dir) if f.startswith('service_detail')]
service_detail_images.sort(key=lambda x: os.path.getsize(os.path.join(extracted_dir, x)), reverse=True)

services = Service.objects.all()
for i, service in enumerate(services):
    if service_detail_images:
        # Give each service a unique hero image if possible, wrapping around if we run out
        img_file = service_detail_images[i % len(service_detail_images)]
        path = os.path.join(extracted_dir, img_file)
        with open(path, 'rb') as f:
            service.hero_image.save(img_file, File(f), save=True)

print("Populated Services with extracted images.")
