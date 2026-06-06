from rest_framework import serializers
from .models import Scholarship, ScholarshipTag, FAQ


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ model"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'category', 'category_display', 'question', 'answer', 'order', 'is_active']
        ref_name = 'ScholarshipFAQ'


class ScholarshipTagSerializer(serializers.ModelSerializer):
    """Serializer for ScholarshipTag"""
    
    class Meta:
        model = ScholarshipTag
        fields = ['id', 'name', 'name_en']


class ScholarshipSerializer(serializers.ModelSerializer):
    """Serializer for Scholarship model"""
    days_remaining = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    country_display = serializers.CharField(source='country', read_only=True)
    scholarship_type_display = serializers.CharField(source='get_scholarship_type_display', read_only=True)
    funding_type_display = serializers.CharField(source='get_funding_type_display', read_only=True)
    faqs = FAQSerializer(many=True, read_only=True)
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'title_en', 'university', 'country',
            'country_display', 'country_code',
            'scholarship_type', 'scholarship_type_display', 'funding_type',
            'funding_type_display', 'description', 'fields', 'stipend', 'benefits',
            'deadline', 'start_date', 'days_remaining', 'is_expired',
            'requirements', 'min_gpa', 'language_requirements', 'faqs',
            'application_url', 'application_fee', 'is_active', 'is_featured',
            'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'days_remaining', 'is_expired']


class ScholarshipListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list view"""
    days_remaining = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'title_en', 'university', 'country', 'country_code',
            'scholarship_type', 'funding_type', 'stipend', 'deadline',
            'days_remaining', 'is_expired', 'is_featured', 'image'
        ]


class ScholarshipDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single scholarship view"""
    days_remaining = serializers.IntegerField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta(ScholarshipSerializer.Meta):
        fields = ScholarshipSerializer.Meta.fields
