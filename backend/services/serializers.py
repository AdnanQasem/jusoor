from rest_framework import serializers
from .models import Service, ServiceOrder


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model"""
    is_popular = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'title_en', 'service_type', 'description',
            'price', 'currency', 'features', 'delivery_time',
            'is_active', 'is_popular', 'icon', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceOrderSerializer(serializers.ModelSerializer):
    """Serializer for ServiceOrder model"""
    service_name = serializers.CharField(source='service.title', read_only=True)
    service_name_en = serializers.CharField(source='service.title_en', read_only=True)
    price = serializers.DecimalField(source='service.price', max_digits=10, decimal_places=2, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ServiceOrder
        fields = [
            'id', 'service', 'service_name', 'service_name_en', 'price',
            'status', 'status_display', 'notes', 'full_name', 'email', 'phone',
            'university', 'field_of_study', 'graduation_year', 'gpa',
            'service_details', 'service_documents', 'payment_method',
            'transaction_id', 'payment_receipt', 'paid_amount',
            'delivered_files', 'delivered_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'delivered_at', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['paid_amount'] = validated_data['service'].price
        return super().create(validated_data)


class ServiceOrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating service orders"""
    
    class Meta:
        model = ServiceOrder
        fields = [
            'id', 'service', 'notes', 'full_name', 'email', 'phone',
            'university', 'field_of_study', 'graduation_year', 'gpa',
            'service_details', 'payment_method', 'transaction_id'
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        validated_data['paid_amount'] = validated_data['service'].price
        return super().create(validated_data)
