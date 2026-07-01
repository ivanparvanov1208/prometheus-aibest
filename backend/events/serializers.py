from rest_framework import serializers
from .models import Event, Registration, NotificationJob
from users.serializers import UserSerializer

class EventSerializer(serializers.ModelSerializer):
    starts_at = serializers.DateTimeField(source='start_time')
    ends_at = serializers.DateTimeField(source='end_time', required=False, allow_null=True)
    organizer_username = serializers.CharField(source='organizer.username', read_only=True)
    confirmed_count = serializers.SerializerMethodField()
    waitlist_count = serializers.SerializerMethodField()
    remaining_spaces = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'starts_at', 'ends_at', 'location', 
            'capacity', 'status', 'organizer', 'organizer_username', 
            'confirmed_count', 'waitlist_count', 'remaining_spaces', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'organizer', 'created_at', 'updated_at']

    def get_confirmed_count(self, obj):
        return obj.get_registered_count()

    def get_waitlist_count(self, obj):
        return obj.registrations.filter(status='WAITLISTED').count()

    def get_remaining_spaces(self, obj):
        return obj.get_available_spots()

class RegistrationSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_id = serializers.IntegerField(source='event.id', read_only=True)
    event = EventSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = [
            'id', 'student', 'student_username', 'event', 'event_id', 'event_title', 
            'status', 'registered_at', 'promoted_at', 'waitlist_position'
        ]
        read_only_fields = ['id', 'registered_at', 'promoted_at', 'waitlist_position']

class NotificationJobSerializer(serializers.ModelSerializer):
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True, allow_null=True)

    class Meta:
        model = NotificationJob
        fields = [
            'id', 'recipient', 'recipient_username', 'event', 'event_title', 
            'message', 'status', 'created_at', 'sent_at'
        ]
