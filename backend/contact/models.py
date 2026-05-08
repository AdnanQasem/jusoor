from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class ContactMessage(models.Model):
    """Contact form messages"""
    
    MESSAGE_TYPES = [
        ('general', _('General Inquiry')),
        ('support', _('Technical Support')),
        ('partnership', _('Partnership')),
        ('other', _('Other')),
    ]
    
    # Contact Info
    name = models.CharField(_('Name'), max_length=200)
    email = models.EmailField(_('Email'))
    phone = models.CharField(_('Phone'), max_length=20, blank=True)
    
    # Message
    message_type = models.CharField(_('Type'), max_length=20, choices=MESSAGE_TYPES, default='general')
    subject = models.CharField(_('Subject'), max_length=300)
    message = models.TextField(_('Message'))
    
    # Status
    is_read = models.BooleanField(_('Read'), default=False)
    is_replied = models.BooleanField(_('Replied'), default=False)
    
    # Admin
    admin_response = models.TextField(_('Admin Response'), blank=True)
    admin_notes = models.TextField(_('Admin Notes'), blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Contact Message')
        verbose_name_plural = _('Contact Messages')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


class FAQ(models.Model):
    """Frequently Asked Questions"""
    
    category = models.CharField(_('Category'), max_length=100)
    question = models.CharField(_('Question'), max_length=500)
    answer = models.TextField(_('Answer'))
    
    # Order
    order = models.IntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQs')
        ordering = ['category', 'order']
    
    def __str__(self):
        return self.question
