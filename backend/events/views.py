from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Q
from .models import Event, Registration, NotificationJob
from .serializers import EventSerializer, RegistrationSerializer, NotificationJobSerializer

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def events_list_create(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        if request.user.role != 'organizer':
            return Response({'error': 'Only organizers can create events.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(organizer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        status_filter = request.query_params.get('status')
        search_query = request.query_params.get('search')
        if request.user.is_authenticated and request.user.role == 'organizer':
            events = Event.objects.filter(organizer=request.user)
        else:
            events = Event.objects.filter(status='PUBLISHED')
        if status_filter:
            events = events.filter(status=status_filter.upper())
        if search_query:
            events = events.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT'])
@permission_classes([AllowAny])
def event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        if event.status != 'PUBLISHED':
            if not request.user.is_authenticated or (request.user.role == 'organizer' and event.organizer != request.user) or (request.user.role == 'student'):
                return Response({'error': 'Event not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EventSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)
        if event.organizer != request.user:
            return Response({'error': 'You can only edit your own events.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def event_publish(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    if event.organizer != request.user:
        return Response({'error': 'You can only publish your own events.'}, status=status.HTTP_403_FORBIDDEN)
    event.status = 'PUBLISHED'
    event.save()
    serializer = EventSerializer(event)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def event_cancel(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    if event.organizer != request.user:
        return Response({'error': 'You can only cancel your own events.'}, status=status.HTTP_403_FORBIDDEN)
    event.status = 'CANCELLED'
    event.save()
    serializer = EventSerializer(event)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def event_registrations_handler(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'POST':
        if request.user.role != 'student':
            return Response({'error': 'Only students can register for events.'}, status=status.HTTP_403_FORBIDDEN)
        if event.status != 'PUBLISHED':
            return Response({'error': 'Event is not published.'}, status=status.HTTP_400_BAD_REQUEST)
        if Registration.objects.filter(student=request.user, event=event).exists():
            return Response({'error': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)
        available_spots = event.get_available_spots()
        if available_spots > 0:
            reg = Registration.objects.create(student=request.user, event=event, status='CONFIRMED')
        else:
            waitlist_pos = Registration.objects.filter(event=event, status='WAITLISTED').count() + 1
            reg = Registration.objects.create(student=request.user, event=event, status='WAITLISTED', waitlist_position=waitlist_pos)
        serializer = RegistrationSerializer(reg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    elif request.method == 'GET':
        if event.organizer != request.user:
            return Response({'error': 'You can only view registrations for your own events.'}, status=status.HTTP_403_FORBIDDEN)
        registrations = Registration.objects.filter(event=event, status='CONFIRMED')
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unregister_from_event(request, registration_id):
    try:
        registration = Registration.objects.get(id=registration_id)
    except Registration.DoesNotExist:
        return Response({'error': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    if registration.student != request.user:
        return Response({'error': 'You can only unregister yourself.'}, status=status.HTTP_403_FORBIDDEN)
    event = registration.event
    was_confirmed = registration.status == 'CONFIRMED'
    registration.delete()
    if was_confirmed:
        promote_from_waitlist(event)
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_registrations(request):
    if request.user.role != 'student':
        return Response({'error': 'Only students can view their registrations.'}, status=status.HTTP_403_FORBIDDEN)
    status_filter = request.query_params.get('status')
    registrations = Registration.objects.filter(student=request.user).select_related('event')
    if status_filter:
        registrations = registrations.filter(status=status_filter.upper())
    serializer = RegistrationSerializer(registrations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_waitlist(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)
    if event.organizer != request.user:
        return Response({'error': 'You can only view waitlist for your own events.'}, status=status.HTTP_403_FORBIDDEN)
    waitlist = Registration.objects.filter(event=event, status='WAITLISTED').order_by('registered_at')
    serializer = RegistrationSerializer(waitlist, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_jobs_list(request):
    if request.user.role != 'organizer':
        return Response({'error': 'Only organizers can view notification jobs.'}, status=status.HTTP_403_FORBIDDEN)
    status_filter = request.query_params.get('status')
    jobs = NotificationJob.objects.all()
    if status_filter:
        jobs = jobs.filter(status=status_filter.upper())
    serializer = NotificationJobSerializer(jobs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def notification_job_detail(request, job_id):
    try:
        job = NotificationJob.objects.get(id=job_id)
    except NotificationJob.DoesNotExist:
        return Response({'error': 'Notification job not found.'}, status=status.HTTP_404_NOT_FOUND)
    if request.user.role != 'organizer':
        return Response({'error': 'Only organizers can view notification jobs.'}, status=status.HTTP_403_FORBIDDEN)
    serializer = NotificationJobSerializer(job)
    return Response(serializer.data, status=status.HTTP_200_OK)

def promote_from_waitlist(event):
    next_in_line = Registration.objects.filter(event=event, status='WAITLISTED').order_by('registered_at').first()
    if next_in_line:
        next_in_line.status = 'CONFIRMED'
        next_in_line.waitlist_position = None
        next_in_line.promoted_at = timezone.now()
        next_in_line.save()
        remaining = Registration.objects.filter(event=event, status='WAITLISTED').order_by('registered_at')
        for i, reg in enumerate(remaining, start=1):
            reg.waitlist_position = i
            reg.save()
