from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'scholarship', 'status', 'has_payment_receipt', 'submitted_at', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'email', 'scholarship__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['submitted_at', 'created_at', 'updated_at']

    fieldsets = (
        (_('Application Information'), {
            'fields': ('user', 'scholarship', 'status')
        }),
        (_('Personal Information'), {
            'fields': ('full_name', 'email', 'phone', 'date_of_birth', 'nationality', 'gender')
        }),
        (_('Academic Information'), {
            'fields': ('education_level', 'gpa', 'university', 'graduation_year', 'field_of_study')
        }),
        (_('Documents'), {
            'fields': ('cover_letter', 'personal_statement', 'cv', 'transcripts', 'recommendation_letters', 'other_documents', 'payment_receipt')
        }),
        (_('Submission'), {
            'fields': ('submitted_at', 'external_application_id')
        }),
        (_('Admin'), {
            'fields': ('admin_notes', 'additional_comments')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def has_payment_receipt(self, obj):
        has_receipt = bool(obj.payment_receipt)
        if has_receipt:
            return True
        return False
    has_payment_receipt.boolean = True
    has_payment_receipt.short_description = _('Payment Receipt')
