from django.http import JsonResponse
from django.db import connection, transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny

from .models import Event, Registration, NotificationJob, User
from .permissions import IsStudent
from .serializers import UserSerializer


def health(request):
    """
    Health check endpoint.
    Verifies database connectivity.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return JsonResponse({
            "status": "UP",
            "database": "CONNECTED"
        })

    except Exception as e:
        return JsonResponse({
            "status": "DOWN",
            "error": str(e)
        }, status=500)


class RegistrationView(CreateAPIView):
    """
    POST /register/
    
    Public endpoint for new user registration.
    - Allows any user to create an account.
    - Defaults to 'student' role.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer


class EventRegistrationView(APIView):
    """
    POST /events/{event_id}/registrations/
    
    Register a student for an event with the following business logic:
    - Only authenticated STUDENT users can register
    - Event must exist
    - Event must be PUBLISHED
    - Prevent duplicate registrations
    - Use atomic transactions with row-level locking
    - Confirm if capacity available, otherwise waitlist
    - Create notification jobs for async processing
    """
    permission_classes = [IsStudent]

    def post(self, request, event_id):
        """
        Register student for an event.
        
        Business Logic:
        1. Verify user is authenticated and is a STUDENT
        2. Verify event exists (404 if not)
        3. Verify event is PUBLISHED (400 if not)
        4. Check for existing registration (400 if duplicate)
        5. Within atomic transaction:
           - Lock event row with select_for_update()
           - Count confirmed registrations
           - Create registration (CONFIRMED or WAITLISTED based on capacity)
           - Create notification job
        6. Return 201 with registration details
        """
        # Verify event exists
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {'detail': f'Event with id {event_id} not found.'},
                status=http_status.HTTP_404_NOT_FOUND
            )

        # Check event is PUBLISHED
        if event.status != 'PUBLISHED':
            return Response(
                {'detail': 'Event must be PUBLISHED to register.'},
                status=http_status.HTTP_400_BAD_REQUEST
            )

        # Use atomic transaction to ensure consistency and prevent race conditions
        with transaction.atomic():
            # Lock the event row to prevent concurrent overbooking
            event = Event.objects.select_for_update().get(id=event_id)

            # Check for existing registration (prevent duplicates)
            existing_registration = Registration.objects.filter(
                student=request.user,
                event=event
            ).first()

            if existing_registration:
                return Response(
                    {'detail': 'You are already registered for this event.'},
                    status=http_status.HTTP_400_BAD_REQUEST
                )

            # Count confirmed registrations to determine if capacity is available
            confirmed_count = Registration.objects.filter(
                event=event,
                status='CONFIRMED'
            ).count()

            # Determine registration status based on available capacity
            if confirmed_count < event.capacity:
                registration_status = 'CONFIRMED'
                notification_event_type = 'RegistrationConfirmed'
            else:
                registration_status = 'WAITLISTED'
                notification_event_type = 'RegistrationWaitlisted'

            # Create registration record
            registration = Registration.objects.create(
                student=request.user,
                event=event,
                status=registration_status
            )

            # Create notification job for asynchronous processing
            NotificationJob.objects.create(
                user=request.user,
                registration=registration,
                event_type=notification_event_type,
                status='PENDING'
            )

        # Build response based on registration status
        response_data = {
            'registration_id': registration.id,
            'status': registration.status
        }

        # Add waitlist position for waitlisted registrations
        if registration.status == 'WAITLISTED':
            # Count waitlisted registrations created before this one (FIFO ordering)
            position = Registration.objects.filter(
                event=event,
                status='WAITLISTED',
                created_at__lt=registration.created_at
            ).count() + 1
            response_data['position'] = position

        return Response(response_data, status=http_status.HTTP_201_CREATED)