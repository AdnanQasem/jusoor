from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom User model for AmDist platform"""
    
    phone = models.CharField(_('Phone Number'), max_length=15, blank=True)
    date_of_birth = models.DateField(_('Date of Birth'), null=True, blank=True)
    city = models.CharField(_('City'), max_length=100, blank=True)
    university = models.CharField(_('University'), max_length=200, blank=True)
    major = models.CharField(_('Major'), max_length=200, blank=True)
    graduation_year = models.IntegerField(_('Graduation Year'), null=True, blank=True)
    gpa = models.DecimalField(_('GPA'), max_digits=4, decimal_places=2, null=True, blank=True)
    profile_picture = models.ImageField(_('Profile Picture'), upload_to='profiles/', null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)
    
    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.username or self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
