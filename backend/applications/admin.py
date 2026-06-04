from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'full_name',
        'email',
        'scholarship',
        'status',
        'palestinian_id_link',
        'cover_letter_snippet',
        'has_payment_receipt',
        'submitted_at',
        'created_at',
    ]
    list_filter = ['status', 'scholarship', 'education_level', 'created_at']
    search_fields = ['full_name', 'email', 'scholarship__title', 'cover_letter']
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
        (_('Work Experience'), {
            'fields': ('work_experience',)
        }),
        (_('Documents'), {
            'fields': ('cover_letter', 'personal_statement', 'palestinian_id', 'transcripts', 'recommendation_letters', 'other_documents', 'payment_receipt')
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

    def palestinian_id_link(self, obj):
        if not obj.palestinian_id:
            return '—'
        return format_html(
            '<a href="{}" target="_blank" rel="noopener noreferrer">عرض الهوية الفلسطينية</a>',
            obj.palestinian_id.url,
        )
    palestinian_id_link.short_description = _('Palestinian ID')

    def cover_letter_snippet(self, obj):
        if not obj.cover_letter:
            return '—'
        text = obj.cover_letter.strip().replace('\n', ' ')
        return text[:90] + ('…' if len(text) > 90 else '')
    cover_letter_snippet.short_description = _('Cover Letter')
