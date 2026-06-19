from django.utils import timezone
from app.models import User, Profile, Event, Registration
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APIClient

# Create users
stu1, created = User.objects.get_or_create(username='student1', defaults={'email':'student1@example.com'})
if created:
    stu1.set_password('pass')
    stu1.role = 'student'
    stu1.save()
    Profile.objects.get_or_create(user=stu1, defaults={'role': 'STUDENT'})

stu2, created = User.objects.get_or_create(username='student2', defaults={'email':'student2@example.com'})
if created:
    stu2.set_password('pass')
    stu2.role = 'student'
    stu2.save()
    Profile.objects.get_or_create(user=stu2, defaults={'role': 'STUDENT'})

org, created = User.objects.get_or_create(username='org1', defaults={'email':'org1@example.com'})
if created:
    org.set_password('pass')
    org.role = 'organizer'
    org.save()
    Profile.objects.get_or_create(user=org, defaults={'role': 'ORGANIZER'})

# Create event with capacity 1
e, created = Event.objects.get_or_create(
    title='Test Event',
    defaults={
        'organizer': org,
        'description': 'Automated test event',
        'location': 'Test Location',
        'starts_at': timezone.now(),
        'ends_at': timezone.now(),
        'capacity': 1,
        'status': 'PUBLISHED'
    }
)
print('Event id', e.id)

# Generate tokens
token1 = str(RefreshToken.for_user(stu1).access_token)
token2 = str(RefreshToken.for_user(stu2).access_token)
print('Generated tokens (truncated) ->', token1[:20] + '...', token2[:20] + '...')

# Test registration endpoint
client = APIClient()
client.credentials(HTTP_AUTHORIZATION='Bearer ' + token1)
resp1 = client.post(f'/api/events/{e.id}/registrations/')
print('student1 ->', resp1.status_code, resp1.data)

client.credentials(HTTP_AUTHORIZATION='Bearer ' + token2)
resp2 = client.post(f'/api/events/{e.id}/registrations/')
print('student2 ->', resp2.status_code, resp2.data)

# Duplicate attempt by student1
client.credentials(HTTP_AUTHORIZATION='Bearer ' + token1)
resp3 = client.post(f'/api/events/{e.id}/registrations/')
print('student1 duplicate ->', resp3.status_code, resp3.data)

# Confirm counts
confirmed = Registration.objects.filter(event=e, status='CONFIRMED').count()
waitlisted = Registration.objects.filter(event=e, status='WAITLISTED').count()
print('confirmed_count=', confirmed, 'waitlisted_count=', waitlisted)
