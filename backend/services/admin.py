from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Service, ServiceOrder


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'service_type', 'price', 'currency', 'is_active', 'is_popular', 'delivery_time']
    list_filter = ['service_type', 'is_active', 'is_popular']
    search_fields = ['title', 'title_en', 'description']
    ordering = ['price']
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'title_en', 'service_type', 'description', 'icon')
        }),
        (_('Pricing'), {
            'fields': ('price', 'currency')
        }),
        (_('Details'), {
            'fields': ('features', 'delivery_time')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_popular')
        }),
    )


@admin.register(ServiceOrder)
class ServiceOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'service', 'status', 'payment_method', 'paid_amount', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['user__username', 'user__email', 'service__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['paid_amount', 'delivered_at', 'created_at', 'updated_at']
    
    fieldsets = (
        (_('Order Information'), {
            'fields': ('user', 'service', 'status')
        }),
        (_('Details'), {
            'fields': ('notes',)
        }),
        (_('Payment'), {
            'fields': ('payment_method', 'transaction_id', 'payment_receipt', 'paid_amount')
        }),
        (_('Delivery'), {
            'fields': ('delivered_files', 'delivered_at')
        }),
    )
