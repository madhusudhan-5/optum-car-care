from rest_framework import serializers
from .models import Service, ServiceFeature, ServiceBeforeAfter, ServiceFAQ, ServiceStandardItem, ServicesPageConfig

class ServiceFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = '__all__'
        extra_kwargs = {'service': {'read_only': True}}

class ServiceBeforeAfterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceBeforeAfter
        fields = '__all__'

class ServiceFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = '__all__'
        extra_kwargs = {'service': {'read_only': True}}

class ServiceStandardItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceStandardItem
        fields = '__all__'
        extra_kwargs = {'service': {'read_only': True}}

class ServiceSerializer(serializers.ModelSerializer):
    features = ServiceFeatureSerializer(many=True, required=False)
    faqs = ServiceFAQSerializer(many=True, required=False)
    standard_items = ServiceStandardItemSerializer(many=True, required=False)
    before_afters = ServiceBeforeAfterSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Service
        fields = '__all__'

    def create(self, validated_data):
        features_data = validated_data.pop('features', [])
        faqs_data = validated_data.pop('faqs', [])
        standard_items_data = validated_data.pop('standard_items', [])

        service = Service.objects.create(**validated_data)

        for f in features_data:
            ServiceFeature.objects.create(service=service, **f)
        for faq in faqs_data:
            ServiceFAQ.objects.create(service=service, **faq)
        for item in standard_items_data:
            ServiceStandardItem.objects.create(service=service, **item)

        return service

    def update(self, instance, validated_data):
        features_data = validated_data.pop('features', None)
        faqs_data = validated_data.pop('faqs', None)
        standard_items_data = validated_data.pop('standard_items', None)

        # Update core fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested features
        if features_data is not None:
            instance.features.all().delete()
            for f in features_data:
                ServiceFeature.objects.create(service=instance, **f)

        # Update nested FAQs
        if faqs_data is not None:
            instance.faqs.all().delete()
            for faq in faqs_data:
                ServiceFAQ.objects.create(service=instance, **faq)

        # Update nested standard items
        if standard_items_data is not None:
            instance.standard_items.all().delete()
            for item in standard_items_data:
                ServiceStandardItem.objects.create(service=instance, **item)

        return instance

class ServicesPageConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesPageConfig
        fields = '__all__'
