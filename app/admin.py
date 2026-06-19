from django.contrib import admin
from .models import User, Profile, Event, Registration, NotificationJob


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    fieldsets = (
        ('Credentials', {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Role', {'fields': ('role',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'status', 'capacity', 'starts_at', 'ends_at')
    list_filter = ('status', 'starts_at', 'created_at')
    search_fields = ('title', 'description', 'organizer__username', 'location')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {'fields': ('title', 'description', 'organizer')}),
        ('Event Details', {'fields': ('location', 'capacity', 'status')}),
        ('Schedule', {'fields': ('starts_at', 'ends_at')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'event', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'event')
    search_fields = ('student__username', 'event__title')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Registration', {'fields': ('student', 'event', 'status')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(NotificationJob)
class NotificationJobAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'event_type', 'status', 'created_at')
    list_filter = ('status', 'event_type', 'created_at')
    search_fields = ('user__username', 'registration__event__title')
    readonly_fields = ('id', 'created_at')
    fieldsets = (
        ('Notification', {'fields': ('id', 'user', 'registration')}),
        ('Details', {'fields': ('event_type', 'status')}),
        ('Timestamps', {'fields': ('created_at',), 'classes': ('collapse',)}),
    )