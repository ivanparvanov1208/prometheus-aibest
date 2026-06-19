from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)
from .views import health, EventRegistrationView, RegistrationView

urlpatterns = [
    # Health check
    path('health/', health, name='health'),
    
    # Authentication
    path("register/", RegistrationView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    # Event Registrations
    path('events/<int:event_id>/registrations/', EventRegistrationView.as_view(), name='event-registration'),
]