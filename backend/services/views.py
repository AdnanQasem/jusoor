from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage
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
    queryset = ServiceOrder.objects.all()
    serializer_class = ServiceOrderSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['-created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'upload_receipt', 'upload_document', 'submit']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ServiceOrder.objects.none()
        if self.action in ['upload_receipt', 'upload_document', 'submit']:
            return ServiceOrder.objects.all()
        if not self.request.user.is_authenticated:
            return ServiceOrder.objects.none()
        return ServiceOrder.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ServiceOrderCreateSerializer
        return ServiceOrderSerializer
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, status='pending')
        else:
            serializer.save(status='pending')

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit service order for review"""
        order = self.get_object()
        if order.status == 'pending':
            order.save()
        return Response({'message': 'تم تقديم طلب الخدمة بنجاح', 'status': order.status})

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload service-related document"""
        order = self.get_object()

        if 'document' not in request.FILES:
            return Response(
                {'error': 'No document file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        doc_type = request.data.get('type', 'other')
        doc_file = request.FILES['document']
        saved_path = default_storage.save(
            f'service_orders/{order.id}/{doc_type}/{doc_file.name}',
            doc_file,
        )

        documents = order.service_documents or []
        documents.append({
            'type': doc_type,
            'name': doc_file.name,
            'url': default_storage.url(saved_path),
            'path': saved_path,
        })
        order.service_documents = documents
        order.save()

        return Response({'message': 'تم رفع المستند بنجاح'})
    
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
