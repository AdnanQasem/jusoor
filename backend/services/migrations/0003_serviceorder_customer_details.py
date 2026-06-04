from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0002_seed_services'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='serviceorder',
            name='user',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='service_orders',
                to=settings.AUTH_USER_MODEL,
                verbose_name='User',
            ),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='full_name',
            field=models.CharField(blank=True, max_length=255, verbose_name='Full Name'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Email'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='phone',
            field=models.CharField(blank=True, max_length=20, verbose_name='Phone'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='university',
            field=models.CharField(blank=True, max_length=255, verbose_name='University'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='field_of_study',
            field=models.CharField(blank=True, max_length=255, verbose_name='Field of Study'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='graduation_year',
            field=models.IntegerField(blank=True, null=True, verbose_name='Graduation Year'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='gpa',
            field=models.CharField(blank=True, max_length=20, verbose_name='GPA'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='service_details',
            field=models.JSONField(blank=True, default=dict, verbose_name='Service Details'),
        ),
        migrations.AddField(
            model_name='serviceorder',
            name='service_documents',
            field=models.JSONField(blank=True, default=list, verbose_name='Service Documents'),
        ),
    ]
