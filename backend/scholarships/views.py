from rest_framework import viewsets, filters, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Scholarship, FAQ
from .serializers import ScholarshipSerializer, ScholarshipListSerializer, FAQSerializer


class ScholarshipViewSet(viewsets.ModelViewSet):
    """ViewSet for managing scholarships"""
    queryset = Scholarship.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['scholarship_type', 'funding_type', 'country', 'is_featured']
    search_fields = ['title', 'title_en', 'university', 'fields']
    ordering_fields = ['deadline', 'created_at', 'days_remaining']
    ordering = ['-deadline']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ScholarshipListSerializer
        return ScholarshipSerializer
    
    def get_queryset(self):
        queryset = Scholarship.objects.filter(is_active=True)
        
        # Filter by featured
        if self.request.query_params.get('featured') == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filter by not expired
        if self.request.query_params.get('not_expired') == 'true':
            from datetime import date
            queryset = queryset.filter(deadline__gte=date.today())
        
        return queryset


class ScholarshipPublicViewSet(viewsets.ReadOnlyModelViewSet):
    """Public read-only viewset for scholarships"""
    queryset = Scholarship.objects.filter(is_active=True).order_by('-deadline')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['scholarship_type', 'country']
    search_fields = ['title', 'title_en', 'university']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ScholarshipListSerializer
        return ScholarshipSerializer


class FAQViewSet(viewsets.ModelViewSet):
    """ViewSet for managing FAQs"""
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'scholarship']
    search_fields = ['question', 'answer']
    ordering_fields = ['order', 'id']
    ordering = ['order', 'id']
    
    def get_queryset(self):
        queryset = FAQ.objects.filter(is_active=True)
        scholarship_id = self.request.query_params.get('scholarship')
        if scholarship_id:
            queryset = queryset.filter(scholarship_id=scholarship_id)
        return queryset
