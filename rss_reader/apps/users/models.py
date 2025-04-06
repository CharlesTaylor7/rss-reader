from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom user model that uses email as the username field."""
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Email & Password are required by default
    
    class Meta:
        db_table = 'users'  # Use the same table name as the SQL migration
