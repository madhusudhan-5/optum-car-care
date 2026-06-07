from rest_framework import viewsets, parsers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import (
    HomePageConfig, CuratedMake, BrandPartner, Testimonial, GeneralFAQ, Promotion,
    ProcessStep, ProcessPageConfig, StudioGalleryItem, StudioExperienceConfig
)
from .serializers import (
    HomePageConfigSerializer, CuratedMakeSerializer, BrandPartnerSerializer,
    TestimonialSerializer, GeneralFAQSerializer, PromotionSerializer,
    ProcessStepSerializer, ProcessPageConfigSerializer, StudioGalleryItemSerializer, StudioExperienceConfigSerializer
)

class HomePageConfigViewSet(viewsets.ModelViewSet):
    queryset = HomePageConfig.objects.all()
    serializer_class = HomePageConfigSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    # Support both JSON and multipart (file uploads)
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    @action(detail=False, methods=['get'])
    def current(self, request):
        config = HomePageConfig.objects.first()
        if config:
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        return Response({})

class CuratedMakeViewSet(viewsets.ModelViewSet):
    queryset = CuratedMake.objects.all()
    serializer_class = CuratedMakeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BrandPartnerViewSet(viewsets.ModelViewSet):
    queryset = BrandPartner.objects.all()
    serializer_class = BrandPartnerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class GeneralFAQViewSet(viewsets.ModelViewSet):
    queryset = GeneralFAQ.objects.all()
    serializer_class = GeneralFAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ProcessStepViewSet(viewsets.ModelViewSet):
    queryset = ProcessStep.objects.all()
    serializer_class = ProcessStepSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class StudioGalleryItemViewSet(viewsets.ModelViewSet):
    queryset = StudioGalleryItem.objects.all()
    serializer_class = StudioGalleryItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

class ProcessPageConfigViewSet(viewsets.ModelViewSet):
    queryset = ProcessPageConfig.objects.all()
    serializer_class = ProcessPageConfigSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    @action(detail=False, methods=['get'])
    def current(self, request):
        config = ProcessPageConfig.objects.first()
        if config:
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        return Response({})

class StudioExperienceConfigViewSet(viewsets.ModelViewSet):
    queryset = StudioExperienceConfig.objects.all()
    serializer_class = StudioExperienceConfigSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        config = StudioExperienceConfig.objects.first()
        if config:
            serializer = self.get_serializer(config)
            return Response(serializer.data)
        return Response({})
