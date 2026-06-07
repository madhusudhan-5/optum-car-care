from django.contrib import admin
from .models import (
    HomePageConfig, PainPoint, StandardItem, AboutFeature,
    CuratedMake, BrandPartner, Testimonial, GeneralFAQ, Promotion
)

class PainPointInline(admin.TabularInline):
    model = PainPoint
    extra = 1

class StandardItemInline(admin.TabularInline):
    model = StandardItem
    extra = 1

class AboutFeatureInline(admin.TabularInline):
    model = AboutFeature
    extra = 1

@admin.register(HomePageConfig)
class HomePageConfigAdmin(admin.ModelAdmin):
    inlines = [PainPointInline, StandardItemInline, AboutFeatureInline]

admin.site.register(CuratedMake)
admin.site.register(BrandPartner)
admin.site.register(Testimonial)
admin.site.register(GeneralFAQ)
admin.site.register(Promotion)
