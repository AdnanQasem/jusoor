from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    """Serializer for Application model"""
    scholarship_title = serializers.CharField(source='scholarship.title', read_only=True)
    scholarship_title_en = serializers.CharField(source='scholarship.title_en', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'scholarship', 'scholarship_title', 'scholarship_title_en',
            'status', 'status_display',
            'full_name', 'email', 'phone', 'date_of_birth', 'nationality', 'gender',
            'education_level', 'gpa', 'university', 'graduation_year', 'field_of_study',
            'additional_comments',
            'cover_letter', 'personal_statement',
            'cv', 'transcripts', 'recommendation_letters', 'other_documents',
            'payment_receipt',
            'submitted_at', 'external_application_id', 'admin_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'submitted_at', 'created_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating applications"""

    class Meta:
        model = Application
        fields = [
            'id',
            'scholarship',
            'full_name', 'email', 'phone', 'date_of_birth', 'nationality', 'gender',
            'education_level', 'gpa', 'university', 'graduation_year', 'field_of_study',
            'additional_comments',
            'cover_letter', 'personal_statement',
            'cv', 'transcripts', 'recommendation_letters'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['status'] = 'draft'
        # Get user from request (may be AnonymousUser if not authenticated)
        if 'request' in self.context:
            user = self.context['request'].user
            if user.is_authenticated:
                validated_data['user'] = user
        return super().create(validated_data)
    
    def validate_scholarship(self, value):
        """Validate that scholarship exists"""
        from scholarships.models import Scholarship
        if not Scholarship.objects.filter(id=value.id).exists():
            raise serializers.ValidationError('المنحة غير موجودة')
        return value
