from django.contrib import admin
from .models import Carrera, Anuncio, LogAuditoria


@admin.register(Carrera)
class CarreraAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'universidad', 'creado_por', 'activo', 'creado_en']
    list_filter = ['activo', 'universidad', 'creado_en']
    search_fields = ['nombre', 'universidad', 'descripcion']
    readonly_fields = ['creado_en', 'actualizado_en']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion', 'universidad', 'duracion')
        }),
        ('Detalles', {
            'fields': ('requisitos', 'campo_laboral', 'link_info')
        }),
        ('Orientación Vocacional', {
            'fields': ('areas_interes', 'habilidades_necesarias')
        }),
        ('Control', {
            'fields': ('creado_por', 'activo', 'creado_en', 'actualizado_en')
        }),
    )


@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'creado_por', 'activo', 'veces_visto', 'creado_en']
    list_filter = ['tipo', 'activo', 'creado_en']
    search_fields = ['titulo', 'contenido']
    readonly_fields = ['creado_en', 'actualizado_en', 'veces_visto']
    
    fieldsets = (
        ('Información', {
            'fields': ('titulo', 'contenido', 'tipo')
        }),
        ('Links', {
            'fields': ('link_zoom', 'link_encuesta', 'link_recurso')
        }),
        ('Control', {
            'fields': ('creado_por', 'activo', 'fecha_publicacion', 'fecha_expiracion')
        }),
        ('Estadísticas', {
            'fields': ('veces_visto', 'creado_en', 'actualizado_en')
        }),
    )


@admin.register(LogAuditoria)
class LogAuditoriaAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'modelo', 'accion', 'timestamp', 'ip_address']
    list_filter = ['accion', 'modelo', 'timestamp']
    search_fields = ['usuario__email', 'modelo', 'objeto_id']
    readonly_fields = ['usuario', 'modelo', 'objeto_id', 'accion', 'detalles', 'ip_address', 'timestamp']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False



