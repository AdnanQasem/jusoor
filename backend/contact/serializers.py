from rest_framework import serializers
from .models import ContactMessage, FAQ, ContactSettings


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for ContactMessage model"""
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'message_type', 'subject',
            'message', 'is_read', 'is_replied', 'admin_response',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_read', 'is_replied', 'admin_response', 'created_at', 'updated_at']


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating contact messages"""
    
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message_type', 'subject', 'message']


class FAQSerializer(serializers.ModelSerializer):
    """Serializer for FAQ model"""
    
    class Meta:
        model = FAQ
        fields = ['id', 'category', 'question', 'answer', 'order', 'is_active']
        read_only_fields = ['id', 'created_at', 'updated_at']
        ref_name = 'ContactFAQ'


class ContactSettingsSerializer(serializers.ModelSerializer):
    """Serializer for public contact settings."""

    class Meta:
        model = ContactSettings
        fields = [
            'email', 'phone', 'facebook_url', 'twitter_url',
            'instagram_url', 'linkedin_url', 'whatsapp_url', 'updated_at'
        ]
        read_only_fields = ['updated_at']
