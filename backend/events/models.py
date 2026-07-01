from django.db import models
from django.conf import settings
from django.utils import timezone

class Event(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('CANCELLED', 'Cancelled'),
        ('CLOSED', 'Closed'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    capacity = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.status})"

    def get_registered_count(self):
        return self.registrations.filter(status='CONFIRMED').count()

    def get_available_spots(self):
        return max(self.capacity - self.get_registered_count(), 0)

class Registration(models.Model):
    STATUS_CHOICES = (
        ('CONFIRMED', 'Confirmed'),
        ('WAITLISTED', 'Waitlisted'),
        ('CANCELLED', 'Cancelled'),
    )

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CONFIRMED')
    registered_at = models.DateTimeField(auto_now_add=True)
    promoted_at = models.DateTimeField(null=True, blank=True)
    waitlist_position = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'event')
        ordering = ['registered_at']

    def __str__(self):
        return f"{self.student.username} - {self.event.title} ({self.status})"

class NotificationJob(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
    )

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Notification to {self.recipient.username} - {self.status}"
