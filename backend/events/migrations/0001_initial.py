import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('start_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('capacity', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('PUBLISHED', 'Published'), ('CANCELLED', 'Cancelled'), ('CLOSED', 'Closed')], default='DRAFT', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organized_events', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('CONFIRMED', 'Confirmed'), ('WAITLISTED', 'Waitlisted'), ('CANCELLED', 'Cancelled')], default='CONFIRMED', max_length=20)),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('promoted_at', models.DateTimeField(blank=True, null=True)),
                ('waitlist_position', models.PositiveIntegerField(blank=True, null=True)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to='events.event')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['registered_at'], 'unique_together': {('student', 'event')}},
        ),
        migrations.CreateModel(
            name='NotificationJob',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('SENT', 'Sent'), ('FAILED', 'Failed')], default='PENDING', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('sent_at', models.DateTimeField(blank=True, null=True)),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]