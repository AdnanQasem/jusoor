from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing scholarship applications"""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
    ordering_fields = ['-created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        return ApplicationSerializer
    
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
        if doc_type == 'cv':
            application.cv = doc_file
        elif doc_type == 'transcripts':
            application.transcripts = doc_file
        elif doc_type == 'recommendation':
            application.recommendation_letters = doc_file
        else:
            # Add to other documents
            application.other_documents.append({
                'type': doc_type,
                'url': doc_file.name
            })
        
        application.save()
        
        return Response({'message': 'تم رفع المستند بنجاح'})
