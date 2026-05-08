from django.db import models
from django.utils.translation import gettext_lazy as _


class Scholarship(models.Model):
    """Scholarship model for available opportunities"""
    
    SCHOLARSHIP_TYPES = [
        ('bachelor', _('Bachelor')),
        ('master', _('Master')),
        ('phd', _('PhD')),
    ]
    
    FUNDING_TYPES = [
        ('full', _('Full Scholarship')),
        ('partial', _('Partial Scholarship')),
    ]
    
    # Basic Information
    title = models.CharField(_('Title'), max_length=200)
    title_en = models.CharField(_('Title (English)'), max_length=200)
    university = models.CharField(_('University'), max_length=300)
    country = models.CharField(_('Country'), max_length=100)
    country_code = models.CharField(_('Country Code'), max_length=2)
    
    # Details
    scholarship_type = models.CharField(_('Type'), max_length=20, choices=SCHOLARSHIP_TYPES)
    funding_type = models.CharField(_('Funding'), max_length=20, choices=FUNDING_TYPES)
    description = models.TextField(_('Description'), blank=True)
    fields = models.JSONField(_('Fields of Study'), default=list)
    
    # Financial
    stipend = models.CharField(_('Stipend'), max_length=100, blank=True)
    benefits = models.TextField(_('Benefits'), blank=True)
    
    # Deadlines
    deadline = models.DateField(_('Deadline'))
    start_date = models.DateField(_('Start Date'), null=True, blank=True)
    
    # Requirements
    requirements = models.TextField(_('Requirements'), blank=True)
    min_gpa = models.DecimalField(_('Minimum GPA'), max_digits=4, decimal_places=2, null=True, blank=True)
    language_requirements = models.TextField(_('Language Requirements'), blank=True)
    
    # Application
    application_url = models.URLField(_('Application URL'), blank=True)
    application_fee = models.BooleanField(_('Application Fee'), default=False)
    
    # Status
    is_active = models.BooleanField(_('Active'), default=True)
    is_featured = models.BooleanField(_('Featured'), default=False)
    
    # Media
    image = models.ImageField(_('Image'), upload_to='scholarships/', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Scholarship')
        verbose_name_plural = _('Scholarships')
        ordering = ['-deadline', '-created_at']
        indexes = [
            models.Index(fields=['-deadline']),
            models.Index(fields=['is_active', '-created_at']),
        ]
    
    def __str__(self):
        return self.title
    
    @property
    def days_remaining(self):
        from datetime import date
        delta = self.deadline - date.today()
        return delta.days
    
    @property
    def is_expired(self):
        return self.days_remaining <= 0


class ScholarshipTag(models.Model):
    """Tags for categorizing scholarships"""
    name = models.CharField(_('Name'), max_length=50, unique=True)
    name_en = models.CharField(_('Name (English)'), max_length=50, unique=True)
    
    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')
    
    def __str__(self):
        return self.name


class FAQ(models.Model):
    """FAQ model for scholarship questions and answers"""
    
    CATEGORY_CHOICES = [
        ('general', _('General')),
        ('application', _('Application')),
        ('requirements', _('Requirements')),
        ('financial', _('Financial')),
        ('visa', _('Visa')),
        ('accommodation', _('Accommodation')),
        ('other', _('Other')),
    ]
    
    scholarship = models.ForeignKey(
        Scholarship,
        verbose_name=_('Scholarship'),
        related_name='faqs',
        on_delete=models.CASCADE
    )
    category = models.CharField(
        _('Category'),
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='general'
    )
    question = models.CharField(_('Question'), max_length=500)
    answer = models.TextField(_('Answer'))
    order = models.PositiveIntegerField(_('Order'), default=0)
    is_active = models.BooleanField(_('Active'), default=True)
    
    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQs')
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['scholarship', 'is_active']),
        ]
    
    def __str__(self):
        return f"FAQ: {self.question[:50]}"
