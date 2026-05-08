from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'scholarship', 'status', 'submitted_at', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__username', 'scholarship__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['submitted_at', 'created_at', 'updated_at']
    
    fieldsets = (
        (_('Application Information'), {
            'fields': ('user', 'scholarship', 'status')
        }),
        (_('Documents'), {
            'fields': ('cover_letter', 'personal_statement', 'cv', 'transcripts', 'recommendation_letters', 'other_documents')
        }),
        (_('Submission'), {
            'fields': ('submitted_at', 'external_application_id')
        }),
        (_('Admin'), {
            'fields': ('admin_notes',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
