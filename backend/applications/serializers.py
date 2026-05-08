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
            'status', 'status_display', 'cover_letter', 'personal_statement',
            'cv', 'transcripts', 'recommendation_letters', 'other_documents',
            'submitted_at', 'external_application_id', 'admin_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'submitted_at', 'created_at', 'updated_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating applications"""
    
    class Meta:
        model = Application
        fields = [
            'scholarship', 'cover_letter', 'personal_statement',
            'cv', 'transcripts', 'recommendation_letters'
        ]
    
    def create(self, validated_data):
        validated_data['status'] = 'draft'
        return super().create(validated_data)
