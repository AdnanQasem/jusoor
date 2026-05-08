from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class Application(models.Model):
    """Scholarship applications submitted by users"""
    
    STATUS_CHOICES = [
        ('draft', _('Draft')),
        ('submitted', _('Submitted')),
        ('under_review', _('Under Review')),
        ('accepted', _('Accepted')),
        ('rejected', _('Rejected')),
    ]
    
    # User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name=_('User')
    )
    
    # Scholarship
    scholarship = models.ForeignKey(
        'scholarships.Scholarship',
        on_delete=models.CASCADE,
        related_name='applications',
        verbose_name=_('Scholarship')
    )
    
    # Status
    status = models.CharField(_('Status'), max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Application Details
    cover_letter = models.TextField(_('Cover Letter'), blank=True)
    personal_statement = models.TextField(_('Personal Statement'), blank=True)
    
    # Documents
    cv = models.FileField(_('CV'), upload_to='applications/cv/', null=True, blank=True)
    transcripts = models.FileField(_('Transcripts'), upload_to='applications/transcripts/', null=True, blank=True)
    recommendation_letters = models.FileField(_('Recommendation Letters'), upload_to='applications/recommendations/', null=True, blank=True)
    other_documents = models.JSONField(_('Other Documents'), default=list)
    
    # Submission
    submitted_at = models.DateTimeField(_('Submitted At'), null=True, blank=True)
    external_application_id = models.CharField(_('External Application ID'), max_length=100, blank=True)
    
    # Notes
    admin_notes = models.TextField(_('Admin Notes'), blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('Application')
        verbose_name_plural = _('Applications')
        ordering = ['-created_at']
        unique_together = ['user', 'scholarship']
    
    def __str__(self):
        return f"{self.user.username} - {self.scholarship.title}"
