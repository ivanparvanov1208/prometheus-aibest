from rest_framework import serializers
from .models import Registration, Event, User

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for Registration model.
    Used in registration responses.
    """
    status = serializers.CharField(read_only=True)
    
    class Meta:
        model = Registration
        fields = ('id', 'status', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

class EventRegistrationResponseSerializer(serializers.Serializer):
    """
    Response serializer for event registration endpoint.
    Handles both confirmed and waitlisted responses.
    """
    registration_id = serializers.IntegerField()
    status = serializers.CharField()
    position = serializers.IntegerField(required=False, allow_null=True)

    def validate_status(self, value):
        """Validate status is either CONFIRMED or WAITLISTED."""
        if value not in ['CONFIRMED', 'WAITLISTED']:
            raise serializers.ValidationError(
                "Status must be either CONFIRMED or WAITLISTED."
            )
        return value

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}, 'role': {'required': False}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        user.role = validated_data.get('role', 'student') # Default to student
        user.save()
        return user