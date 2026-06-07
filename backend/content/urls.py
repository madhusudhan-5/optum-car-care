from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HomePageConfigViewSet, CuratedMakeViewSet, BrandPartnerViewSet,
    TestimonialViewSet, GeneralFAQViewSet, PromotionViewSet,
    ProcessStepViewSet, ProcessPageConfigViewSet, StudioGalleryItemViewSet, StudioExperienceConfigViewSet
)

router = DefaultRouter()
router.register(r'home-config', HomePageConfigViewSet)
router.register(r'makes', CuratedMakeViewSet)
router.register(r'partners', BrandPartnerViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'faqs', GeneralFAQViewSet)
router.register(r'promotions', PromotionViewSet)
router.register(r'process', ProcessStepViewSet)
router.register(r'process-config', ProcessPageConfigViewSet)
router.register(r'studio-gallery', StudioGalleryItemViewSet)
router.register(r'studio-config', StudioExperienceConfigViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
