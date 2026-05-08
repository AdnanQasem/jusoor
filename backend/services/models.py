from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Service(models.Model):
    """Available services offered by AmDist"""
    
    SERVICE_TYPES = [
        ('cv', _('CV/Resume')),
        ('cover_letter', _('Cover Letter')),
        ('full_application', _('Full Application')),
        ('translation', _('Translation')),
        ('consultation', _('Consultation')),
    ]
    
    title = models.CharField(_('Title'), max_length=200)
    title_en = models.CharField(_('Title (English)'), max_length=200)
    service_type = models.CharField(_('Type'), max_length=20, choices=SERVICE_TYPES, unique=True)
    description = models.TextField(_('Description'))
    price = models.DecimalField(_('Price'), max_digits=10, decimal_places=2)
    currency = models.CharField(_('Currency'), max_length=3, default='ILS')
    
    # Features
    features = models.JSONField(_('Features'), default=list)
    delivery_time = models.CharField(_('Delivery Time'), max_length=50)
    
    # Status
    is_active = models.BooleanField(_('Active'), default=True)
    is_popular = models.BooleanField(_('Popular'), default=False)
    
    # Media
    icon = models.CharField(_('Icon'), max_length=50, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Service')
        verbose_name_plural = _('Services')
        ordering = ['price']
    
    def __str__(self):
        return self.title


class ServiceOrder(models.Model):
    """Orders placed for services"""
    
    STATUS_CHOICES = [
        ('pending', _('Pending Payment')),
        ('paid', _('Paid')),
        ('in_progress', _('In Progress')),
        ('completed', _('Completed')),
        ('cancelled', _('Cancelled')),
        ('refunded', _('Refunded')),
    ]
    
    # User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='service_orders',
        verbose_name=_('User')
    )
    
    # Service
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name=_('Service')
    )
    
    # Order Details
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(_('Notes'), blank=True)
    
    # Payment
    payment_method = models.CharField(_('Payment Method'), max_length=20, default='palpay')
    transaction_id = models.CharField(_('Transaction ID'), max_length=100, blank=True)
    payment_receipt = models.ImageField(_('Payment Receipt'), upload_to='payments/', null=True, blank=True)
    paid_amount = models.DecimalField(_('Paid Amount'), max_digits=10, decimal_places=2)
    
    # Delivery
    delivered_files = models.JSONField(_('Delivered Files'), default=list)
    delivered_at = models.DateTimeField(_('Delivered At'), null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Service Order')
        verbose_name_plural = _('Service Orders')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - {self.service.title}"
    
    @property
    def is_paid(self):
        return self.status == 'paid'
