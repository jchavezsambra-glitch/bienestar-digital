from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UsuarioManager(BaseUserManager):
    """Manager personalizado para el modelo Usuario"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El usuario debe tener un email')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('rol', 'profesor')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuario personalizado con roles"""
    
    ROLES_CHOICES = [
        ('profesor', 'Profesor/Administrador'),
        ('estudiante', 'Estudiante'),
        ('apoderado', 'Apoderado'),
    ]
    
    email = models.EmailField(unique=True, verbose_name='Correo electrónico')
    nombres = models.CharField(max_length=100, verbose_name='Nombres')
    apellidos = models.CharField(max_length=100, verbose_name='Apellidos')
    rol = models.CharField(max_length=20, choices=ROLES_CHOICES, default='estudiante', verbose_name='Rol')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    
    # Campos adicionales para estudiantes
    curso = models.CharField(max_length=50, blank=True, null=True, verbose_name='Curso')
    rut = models.CharField(max_length=12, blank=True, null=True, unique=True, verbose_name='RUT')
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombres', 'apellidos']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.nombres} {self.apellidos} ({self.get_rol_display()})"
    
    def get_full_name(self):
        return f"{self.nombres} {self.apellidos}"
    
    def es_profesor(self):
        return self.rol == 'profesor' or self.is_staff
    
    def es_estudiante(self):
        return self.rol == 'estudiante'
    
    def es_apoderado(self):
        return self.rol == 'apoderado'



