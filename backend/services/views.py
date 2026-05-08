from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service, ServiceOrder
from .serializers import ServiceSerializer, ServiceOrderSerializer, ServiceOrderCreateSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only viewset for services"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['service_type', 'is_popular']


class ServiceOrderViewSet(viewsets.ModelViewSet):
    """ViewSet for managing service orders"""
    serializer_class = ServiceOrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['-created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return ServiceOrder.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ServiceOrderCreateSerializer
        return ServiceOrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='pending')
    
    @action(detail=True, methods=['post'])
    def upload_receipt(self, request, pk=None):
        """Upload payment receipt"""
        order = self.get_object()
        
        if 'receipt' not in request.FILES:
            return Response(
                {'error': 'No receipt file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.payment_receipt = request.FILES['receipt']
        order.status = 'paid'
        order.save()
        
        return Response({
            'message': 'تم استلام الإيصال بنجاح',
            'status': order.status
        })
