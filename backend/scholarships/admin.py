from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Scholarship, ScholarshipTag, FAQ


class FAQInline(admin.TabularInline):
    model = FAQ
    extra = 1
    fields = ['category', 'question', 'answer', 'order', 'is_active']
    ordering = ['order', 'id']


@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'university', 'country', 'scholarship_type', 'deadline', 'is_active', 'is_featured']
    list_filter = ['scholarship_type', 'funding_type', 'country', 'is_active', 'is_featured']
    search_fields = ['title', 'title_en', 'university', 'fields']
    ordering = ['-deadline']
    date_hierarchy = 'deadline'
    inlines = [FAQInline]
    
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('title', 'title_en', 'university', 'country', 'country_code', 'image')
        }),
        (_('Details'), {
            'fields': ('scholarship_type', 'funding_type', 'description', 'fields')
        }),
        (_('Financial'), {
            'fields': ('stipend', 'benefits')
        }),
        (_('Deadlines'), {
            'fields': ('deadline', 'start_date')
        }),
        (_('Requirements'), {
            'fields': ('requirements', 'min_gpa', 'language_requirements')
        }),
        (_('Application'), {
            'fields': ('application_url', 'application_fee')
        }),
        (_('Status'), {
            'fields': ('is_active', 'is_featured')
        }),
    )


@admin.register(ScholarshipTag)
class ScholarshipTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'name_en']
    search_fields = ['name', 'name_en']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'scholarship', 'category', 'order', 'is_active']
    list_filter = ['category', 'is_active', 'scholarship']
    search_fields = ['question', 'answer', 'scholarship__title']
    ordering = ['order', 'id']
    
    fieldsets = (
        (_('FAQ Details'), {
            'fields': ('scholarship', 'category', 'question', 'answer', 'order', 'is_active')
        }),
    )
