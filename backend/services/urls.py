from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, ServiceFeatureViewSet, ServiceBeforeAfterViewSet,
    ServiceFAQViewSet, ServiceStandardItemViewSet, ServicesPageConfigViewSet
)

router = DefaultRouter()
router.register(r'', ServiceViewSet)
router.register(r'features', ServiceFeatureViewSet)
router.register(r'before-afters', ServiceBeforeAfterViewSet)
router.register(r'faqs', ServiceFAQViewSet)
router.register(r'standards', ServiceStandardItemViewSet)
router.register(r'config', ServicesPageConfigViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
