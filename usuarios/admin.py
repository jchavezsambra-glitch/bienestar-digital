from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ['email', 'nombres', 'apellidos', 'rol', 'curso', 'is_active', 'date_joined']
    list_filter = ['rol', 'is_active', 'is_staff']
    search_fields = ['email', 'nombres', 'apellidos', 'rut']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombres', 'apellidos', 'rut')}),
        ('Información Academica', {'fields': ('rol', 'curso')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas', {'fields': ('date_joined', 'last_login')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'nombres', 'apellidos', 'rol'),
        }),
    )



