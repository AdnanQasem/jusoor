import logging
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer

logger = logging.getLogger(__name__)


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing scholarship applications"""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.AllowAny]  # Allow anyone to submit applications
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['-created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Application.objects.filter(user=self.request.user)
        return Application.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer

    def create(self, request, *args, **kwargs):
        logger.info(f"Creating application with data: {request.data}")
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        try:
            if self.request.user.is_authenticated:
                serializer.save(user=self.request.user)
            else:
                serializer.save()
            logger.info(f"Application created successfully for user: {self.request.user}")
        except Exception as e:
            logger.error(f"Error creating application: {str(e)}")
            raise

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """Submit application for review"""
        application = self.get_object()

        if application.status != 'draft':
            return Response(
                {'error': 'Cannot submit application that is not in draft status'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.status = 'submitted'
        application.submitted_at = timezone.now()
        application.save()

        return Response({'message': 'تم تقديم الطلب بنجاح'})

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload additional document"""
        application = self.get_object()

        if 'document' not in request.FILES:
            return Response(
                {'error': 'No document file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        doc_type = request.data.get('type', 'other')
        doc_file = request.FILES['document']

        # Save document based on type
        if doc_type in ['cv', 'palestinian_id']:
            application.palestinian_id = doc_file
        elif doc_type in ['transcript', 'transcripts']:
            application.transcripts = doc_file
        elif doc_type in ['recommendation', 'recommendation_letter', 'recommendation_letters']:
            application.recommendation_letters = doc_file
        else:
            saved_path = default_storage.save(
                f'applications/other/{application.id}/{doc_file.name}',
                doc_file,
            )
            other_documents = application.other_documents or []
            other_documents.append({
                'type': doc_type,
                'name': doc_file.name,
                'url': default_storage.url(saved_path),
                'path': saved_path,
            })
            application.other_documents = other_documents

        application.save()

        return Response({'message': 'تم رفع المستند بنجاح'})

    @action(detail=True, methods=['post'])
    def upload_receipt(self, request, pk=None):
        """Upload payment receipt"""
        application = self.get_object()

        if 'receipt' not in request.FILES:
            return Response(
                {'error': 'No receipt file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        application.payment_receipt = request.FILES['receipt']
        application.save()

        return Response({'message': 'تم رفع إيصال الدفع بنجاح'})
