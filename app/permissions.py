from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    """
    Permission class to check if the user is a student.
    Only users with role='student' are allowed.
    """
    message = "Only STUDENT users can perform this action."

    def has_permission(self, request, view):
        """
        Check if user is authenticated and has the STUDENT role.
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'student'
        )
