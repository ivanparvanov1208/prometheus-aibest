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
        ('student', 'STUDENT'),
        ('organizer', 'ORGANIZER'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Profile(models.Model):
    '''
    User profile with role information.
    Extends the User model with additional profile data.
    '''
    ROLE_CHOICES = (
        ('STUDENT', 'Student'),
        ('ORGANIZER', 'Organizer'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='STUDENT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

    class Meta:
        verbose_name_plural = "Profiles"

class Event(models.Model):
    '''
    Represents an event created by an organizer.
    '''
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
        ('CANCELLED', 'Cancelled'),
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
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    capacity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['starts_at']

    def __str__(self):
        return self.title

class Registration(models.Model):
    '''
    Represents a student's registration for an event.
    '''
    STATUS_CHOICES = (
        ('CONFIRMED', 'Confirmed'),
        ('WAITLISTED', 'Waitlisted'),
        ('CANCELLED', 'Cancelled'),
    )

    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='registrations',
        limit_choices_to={'role': 'student'}
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITLISTED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'event')
        ordering = ['created_at']

    def __str__(self):
        return f"{self.student.username} - {self.event.title} ({self.status})"

class NotificationJob(models.Model):
    '''
    Stores details for asynchronous notification processing.
    '''
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    )
    
    EVENT_TYPE_CHOICES = (
        ('RegistrationConfirmed', 'Registration Confirmed'),
        ('RegistrationWaitlisted', 'Registration Waitlisted'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_jobs')
    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='notification_jobs', null=True, blank=True)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"Notification {self.id} - {self.event_type} ({self.status})"