from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ("applications", "0003_alter_application_unique_together_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="application",
            name="user",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="applications",
                to=settings.AUTH_USER_MODEL,
                verbose_name="User",
            ),
        ),
    ]
