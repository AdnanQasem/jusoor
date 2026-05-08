from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from scholarships.views import ScholarshipViewSet, FAQViewSet as ScholarshipFAQViewSet
from services.views import ServiceViewSet, ServiceOrderViewSet
from applications.views import ApplicationViewSet
from contact.views import ContactMessageViewSet, FAQViewSet as ContactFAQViewSet

router = DefaultRouter()
router.register(r'scholarships', ScholarshipViewSet, basename='scholarship')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'service-orders', ServiceOrderViewSet, basename='service-order')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'contact-faq', ContactFAQViewSet, basename='contact-faq')
router.register(r'scholarship-faq', ScholarshipFAQViewSet, basename='scholarship-faq')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API
    path('api/', include([
        # Auth
        path('auth/', include('accounts.urls')),
        
        # Resources
        path('', include(router.urls)),
    ])),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "أمديست | لوحة التحكم"
admin.site.site_title = "أمديست"
admin.site.index_title = "لوحة التحكم"
