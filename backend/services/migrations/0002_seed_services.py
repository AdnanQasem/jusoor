from django.db import migrations


def create_services(apps, schema_editor):
    Service = apps.get_model('services', 'Service')
    services = [
        Service(
            title='السيرة الذاتية الاحترافية',
            title_en='Professional CV/Resume',
            service_type='cv',
            description='إعداد سيرة ذاتية احترافية مصممة خصيصاً للتقديم على المنح الدراسية والجامعات العالمية. نضمن أن سيرتك تبرز خبراتك ومهاراتك بالشكل الأمثل.',
            price=150.00,
            currency='ILS',
            features=[
                'تصميم احترافي حسب المعايير الأكاديمية',
                'صياغة ملخص مهني قوي',
                'تنسيق الخبرات والتعليم بشكل مبدع',
                'تضمين الكلمات المفتاحية المناسبة',
                'مراجعة وتدقيق لغوي كامل',
                'تسليم خلال 3 أيام عمل'
            ],
            delivery_time='3 أيام عمل',
            is_active=True,
            is_popular=False,
            icon='FileText'
        ),
        Service(
            title='رسالة التحفيز',
            title_en='Motivation Letter',
            service_type='cover_letter',
            description='كتابة رسالة تحفيزية مقنعة ومميزة تعكس شغفك وأهدافك الأكاديمية. تُعد رسالة التحفيز من أهم عناصر الطلب وتحدد فرصك في القبول.',
            price=200.00,
            currency='ILS',
            features=[
                'كتابة مخصصة لكل منحة أو جامعة',
                'إبراز الدوافع والأهداف الأكاديمية',
                'ربط الخبرات بالمتطلبات المطلوبة',
                'مراجعة وتعديل حتى الرضا التام',
                'صياغة قوية ومقنعة باللغة المطلوبة',
                'تسليم خلال 4 أيام عمل'
            ],
            delivery_time='4 أيام عمل',
            is_active=True,
            is_popular=True,
            icon='BookOpen'
        ),
        Service(
            title='التقديم الشامل',
            title_en='Full Application Package',
            service_type='full_application',
            description='باقة متكاملة تشمل إعداد جميع مستندات التقديم من السيرة الذاتية ورسالة التحفيز إلى ملء الاستمارات والتنسيق النهائي. الأنسب للمتقدمين الجادين.',
            price=450.00,
            currency='ILS',
            features=[
                'سيرة ذاتية احترافية',
                'رسالة تحفيز مخصصة',
                'ملء استمارات التقديم',
                'ترتيب وتنسيق المستندات المطلوبة',
                'مراجعة شاملة قبل الإرسال',
                'دعم ومتابعة لمدة أسبوع بعد التسليم',
                'تسليم خلال 7 أيام عمل'
            ],
            delivery_time='7 أيام عمل',
            is_active=True,
            is_popular=True,
            icon='Rocket'
        ),
    ]
    Service.objects.bulk_create(services)


def reverse_services(apps, schema_editor):
    Service = apps.get_model('services', 'Service')
    Service.objects.filter(service_type__in=['cv', 'cover_letter', 'full_application']).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_services, reverse_services),
    ]