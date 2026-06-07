from rest_framework import serializers
from .models import (
    HomePageConfig, PainPoint, StandardItem, AboutFeature,
    CuratedMake, BrandPartner, Testimonial, GeneralFAQ, Promotion,
    ProcessStep, ProcessPageConfig, StudioGalleryItem, StudioExperienceConfig
)

class PainPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = PainPoint
        fields = '__all__'
        extra_kwargs = {'config': {'read_only': True}}

class StandardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StandardItem
        fields = '__all__'
        extra_kwargs = {'config': {'read_only': True}}

class AboutFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutFeature
        fields = '__all__'
        extra_kwargs = {'config': {'read_only': True}}

class HomePageConfigSerializer(serializers.ModelSerializer):
    pain_points = PainPointSerializer(many=True, required=False)
    standard_items = StandardItemSerializer(many=True, required=False)
    about_features = AboutFeatureSerializer(many=True, required=False)

    class Meta:
        model = HomePageConfig
        fields = '__all__'

    def update(self, instance, validated_data):
        pain_points_data = validated_data.pop('pain_points', None)
        standard_items_data = validated_data.pop('standard_items', None)
        about_features_data = validated_data.pop('about_features', None)

        # Update core fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested pain points
        if pain_points_data is not None:
            instance.pain_points.all().delete()
            for pp in pain_points_data:
                PainPoint.objects.create(config=instance, text=pp.get('text'))

        # Update nested standard items
        if standard_items_data is not None:
            instance.standard_items.all().delete()
            for s in standard_items_data:
                StandardItem.objects.create(config=instance, text=s.get('text'))

        # Update nested about features
        if about_features_data is not None:
            instance.about_features.all().delete()
            for a in about_features_data:
                AboutFeature.objects.create(config=instance, text=a.get('text'))

        return instance

class CuratedMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuratedMake
        fields = '__all__'

class BrandPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandPartner
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class GeneralFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralFAQ
        fields = '__all__'

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = '__all__'

class ProcessPageConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessPageConfig
        fields = '__all__'

class StudioGalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioGalleryItem
        fields = '__all__'

class StudioExperienceConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioExperienceConfig
        fields = '__all__'
