from django.contrib import admin
from .models import User, Registration, NotificationJob

admin.site.register(User)
admin.site.register(Registration)
admin.site.register(NotificationJob)