from django.urls import path
from . import views

urlpatterns = [
    # Events
    path('events', views.events_list_create, name='events_list_create'),
    path('events/<int:event_id>', views.event_detail, name='event_detail'),
    path('events/<int:event_id>/publish', views.event_publish, name='event_publish'),
    path('events/<int:event_id>/cancel', views.event_cancel, name='event_cancel'),

    # Registrations
    path('events/<int:event_id>/registrations', views.event_registrations_handler, name='event_registrations_handler'),
    path('registrations/<int:registration_id>', views.unregister_from_event, name='unregister_from_event'),
    path('registrations/me', views.my_registrations, name='my_registrations'),
    path('events/<int:event_id>/waitlist', views.event_waitlist, name='event_waitlist'),

    # Notifications
    path('notification-jobs', views.notification_jobs_list, name='notification_jobs_list'),
    path('notification-jobs/<int:job_id>', views.notification_job_detail, name='notification_job_detail'),
]
