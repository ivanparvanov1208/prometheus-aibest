from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class User(AbstractUser):
    '''
    Custom User model to support both 'student' and 'organizer' roles.
    This model extends Django's AbstractUser to include a role field.
    '''
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('organizer', 'Organizer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.username} ({self.role})"

class Event(models.Model):
    '''
    Represents an event created by an organizer.
    '''
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('canceled', 'Canceled'),
    )

    organizer = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='organized_events',
        limit_choices_to={'role': 'organizer'}
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255, blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    capacity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return self.title

class Registration(models.Model):
    '''
    Represents a student's registration for an event.
    '''
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('waitlisted', 'Waitlisted'),
        ('canceled', 'Canceled'),
    )

    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='registrations',
        limit_choices_to={'role': 'student'}
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='waitlisted') # Default to waitlisted, logic will confirm if capacity allows
    registered_at = models.DateTimeField(auto_now_add=True)
    waitlist_position = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('student', 'event') # A student can only register for an event once
        ordering = ['registered_at'] # Important for FIFO waitlist

    def __str__(self):
        return f"{self.student.username} - {self.event.title} ({self.status})"

class NotificationJob(models.Model):
    '''
    Stores details for asynchronous notification processing.
    '''
    JOB_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    )
    EVENT_TYPE_CHOICES = (
        ('registration_confirmed', 'Registration Confirmed'),
        ('waitlist_promoted', 'Waitlist Promoted'),
        ('event_canceled', 'Event Canceled'),
        ('registration_canceled', 'Registration Canceled'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # For idempotency
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    event_payload = models.JSONField() # Stores data relevant to the notification, e.g., user_id, event_id
    status = models.CharField(max_length=10, choices=JOB_STATUS_CHOICES, default='pending')
    retries = models.PositiveIntegerField(default=0)
    max_retries = models.PositiveIntegerField(default=3) # Configurable max retries
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Notification Job {self.id} - {self.event.title} ({self.status})"