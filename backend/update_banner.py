import os
import django
import sys
sys.path.append('/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from content.models import HomePageConfig
from django.core.files import File

config = HomePageConfig.objects.first()
if config:
    path = '/Users/madhusudhanm/Documents/GIT/OPTUM_CAR_CARE/frontend/public/car_banner.jpeg'
    if os.path.exists(path):
        with open(path, 'rb') as f:
            config.banner_image.save('car_banner.jpeg', File(f), save=True)
        print("Updated banner_image to car_banner.jpeg")
    else:
        print("Could not find car_banner.jpeg")
