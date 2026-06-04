from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Service, ServiceOrder, CVServiceOrder, CoverLetterServiceOrder


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


class BaseServiceOrderAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'full_name',
        'email',
        'service',
        'status',
        'payment_method',
        'paid_amount',
        'created_at',
    ]
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'service__title']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    readonly_fields = ['paid_amount', 'delivered_at', 'created_at', 'updated_at']
    service_type_filter = None

    fieldsets = (
        (_('Order Information'), {
            'fields': ('user', 'service', 'status')
        }),
        (_('Customer Details'), {
            'fields': (
                'full_name', 'email', 'phone',
                'university', 'field_of_study', 'graduation_year', 'gpa',
            )
        }),
        (_('Request Details'), {
            'fields': ('notes', 'service_details', 'service_documents')
        }),
        (_('Payment'), {
            'fields': ('payment_method', 'transaction_id', 'payment_receipt', 'paid_amount')
        }),
        (_('Delivery'), {
            'fields': ('delivered_files', 'delivered_at')
        }),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if self.service_type_filter:
            queryset = queryset.filter(service__service_type=self.service_type_filter)
        return queryset

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'service' and self.service_type_filter:
            kwargs['queryset'] = Service.objects.filter(service_type=self.service_type_filter)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(CVServiceOrder)
class CVServiceOrderAdmin(BaseServiceOrderAdmin):
    service_type_filter = 'cv'

    def get_queryset(self, request):
        return super().get_queryset(request)


@admin.register(CoverLetterServiceOrder)
class CoverLetterServiceOrderAdmin(BaseServiceOrderAdmin):
    service_type_filter = 'cover_letter'

    def get_queryset(self, request):
        return super().get_queryset(request)

