from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import ContactMessage, FAQ


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'message_type', 'subject', 'is_read', 'is_replied', 'created_at']
    list_filter = ['message_type', 'is_read', 'is_replied', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        (_('Contact Information'), {
            'fields': ('name', 'email', 'phone')
        }),
        (_('Message'), {
            'fields': ('message_type', 'subject', 'message')
        }),
        (_('Status'), {
            'fields': ('is_read', 'is_replied')
        }),
        (_('Admin Response'), {
            'fields': ('admin_response', 'admin_notes')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_replied']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = _("Mark selected as read")
    
    def mark_as_replied(self, request, queryset):
        queryset.update(is_replied=True)
    mark_as_replied.short_description = _("Mark selected as replied")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'answer']
    ordering = ['category', 'order']
