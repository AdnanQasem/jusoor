from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from .models import ContactMessage, FAQ, ContactSettings
from .serializers import (
    ContactMessageSerializer,
    ContactMessageCreateSerializer,
    FAQSerializer,
    ContactSettingsSerializer,
)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for contact messages"""
    queryset = ContactMessage.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['message_type', 'is_read', 'is_replied']
    ordering_fields = ['-created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'تم استلام رسالتك بنجاح. سنتواصل معك قريباً.',
            'data': ContactMessageSerializer(serializer.instance).data
        }, status=status.HTTP_201_CREATED)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only viewset for FAQs"""
    queryset = FAQ.objects.filter(is_active=True).order_by('category', 'order')
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']


class ContactSettingsViewSet(viewsets.ViewSet):
    """Public endpoint for admin-managed contact page details."""

    serializer_class = ContactSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        serializer = ContactSettingsSerializer(ContactSettings.load())
        return Response(serializer.data)
