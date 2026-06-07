from django.contrib import admin
from .models import Service, ServiceFeature, ServiceBeforeAfter, ServiceFAQ, ServiceStandardItem

class ServiceFeatureInline(admin.StackedInline):
    model = ServiceFeature
    extra = 1

class ServiceBeforeAfterInline(admin.StackedInline):
    model = ServiceBeforeAfter
    extra = 1

class ServiceFAQInline(admin.StackedInline):
    model = ServiceFAQ
    extra = 1

class ServiceStandardItemInline(admin.StackedInline):
    model = ServiceStandardItem
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    inlines = [ServiceFeatureInline, ServiceBeforeAfterInline, ServiceFAQInline, ServiceStandardItemInline]
    prepopulated_fields = {'slug': ('title',)}
