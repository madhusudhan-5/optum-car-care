from rest_framework import viewsets, parsers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Service, ServiceFeature, ServiceBeforeAfter, ServiceFAQ, ServiceStandardItem, ServicesPageConfig
from .serializers import (
    ServiceSerializer, ServiceFeatureSerializer, ServiceBeforeAfterSerializer, 
    ServiceFAQSerializer, ServiceStandardItemSerializer, ServicesPageConfigSerializer
)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]


class ServiceFeatureViewSet(viewsets.ModelViewSet):
    queryset = ServiceFeature.objects.all()
    serializer_class = ServiceFeatureSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServiceBeforeAfterViewSet(viewsets.ModelViewSet):
    queryset = ServiceBeforeAfter.objects.all()
    serializer_class = ServiceBeforeAfterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServiceFAQViewSet(viewsets.ModelViewSet):
    queryset = ServiceFAQ.objects.all()
    serializer_class = ServiceFAQSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServiceStandardItemViewSet(viewsets.ModelViewSet):
    queryset = ServiceStandardItem.objects.all()
    serializer_class = ServiceStandardItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServicesPageConfigViewSet(viewsets.ModelViewSet):
    queryset = ServicesPageConfig.objects.all()
    serializer_class = ServicesPageConfigSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    from rest_framework.decorators import action
    from rest_framework.response import Response

    @action(detail=False, methods=['get'])
    def current(self, request):
        config = ServicesPageConfig.objects.first()
        if config:
            serializer = self.get_serializer(config)
            return self.Response(serializer.data)
        return self.Response({})
