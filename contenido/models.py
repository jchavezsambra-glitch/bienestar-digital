from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from django.utils import timezone

Usuario = get_user_model()


class Carrera(models.Model):
    """Modelo para almacenar información sobre carreras universitarias"""
    
    nombre = models.CharField(max_length=200, verbose_name='Nombre de la carrera')
    descripcion = models.TextField(verbose_name='Descripción')
    universidad = models.CharField(max_length=200, verbose_name='Universidad')
    duracion = models.CharField(max_length=50, verbose_name='Duración')
    requisitos = models.TextField(blank=True, null=True, verbose_name='Requisitos')
    campo_laboral = models.TextField(blank=True, null=True, verbose_name='Campo laboral')
    link_info = models.URLField(blank=True, null=True, verbose_name='Link de información')
    
    # Campos para orientación vocacional
    areas_interes = models.CharField(max_length=500, blank=True, null=True, verbose_name='Áreas de interés')
    habilidades_necesarias = models.TextField(blank=True, null=True, verbose_name='Habilidades necesarias')
    
    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='carreras_creadas')
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Carrera'
        verbose_name_plural = 'Carreras'
        ordering = ['nombre']
    
    def __str__(self):
        return f"{self.nombre} - {self.universidad}"


class Anuncio(models.Model):
    """Modelo para anuncios creados por profesores"""
    
    TIPO_CHOICES = [
        ('general', 'Anuncio General'),
        ('zoom', 'Link de Zoom'),
        ('encuesta', 'Encuesta'),
        ('recurso', 'Recurso Educativo'),
    ]
    
    titulo = models.CharField(max_length=200, verbose_name='Título')
    contenido = models.TextField(verbose_name='Contenido')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='general', verbose_name='Tipo')
    
    # Campos para links
    link_zoom = models.URLField(blank=True, null=True, verbose_name='Link de Zoom')
    link_encuesta = models.URLField(blank=True, null=True, verbose_name='Link de Encuesta')
    link_recurso = models.URLField(blank=True, null=True, verbose_name='Link de Recurso')
    
    # Campos de control
    creado_por = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='anuncios_creados')
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    fecha_publicacion = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de publicación')
    fecha_expiracion = models.DateTimeField(null=True, blank=True, verbose_name='Fecha de expiración')
    activo = models.BooleanField(default=True)
    
    # Auditoría
    veces_visto = models.IntegerField(default=0, verbose_name='Veces visto')
    
    class Meta:
        verbose_name = 'Anuncio'
        verbose_name_plural = 'Anuncios'
        ordering = ['-creado_en']
    
    def __str__(self):
        return f"{self.titulo} ({self.get_tipo_display()})"
    
    def esta_activo(self):
        """Verifica si el anuncio está activo según fechas"""
        ahora = timezone.now()
        if self.fecha_publicacion and ahora < self.fecha_publicacion:
            return False
        if self.fecha_expiracion and ahora > self.fecha_expiracion:
            return False
        return self.activo
    
    def incrementar_vistas(self):
        """Incrementa el contador de vistas"""
        self.veces_visto += 1
        self.save(update_fields=['veces_visto'])


class LogAuditoria(models.Model):
    """Modelo para logs de auditoría de cambios en datos críticos"""
    
    ACCION_CHOICES = [
        ('CREATE', 'Crear'),
        ('UPDATE', 'Actualizar'),
        ('DELETE', 'Eliminar'),
        ('VIEW', 'Ver'),
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, related_name='logs_auditoria')
    modelo = models.CharField(max_length=100, verbose_name='Modelo')
    objeto_id = models.CharField(max_length=100, verbose_name='ID del objeto')
    accion = models.CharField(max_length=10, choices=ACCION_CHOICES, verbose_name='Acción')
    detalles = models.JSONField(default=dict, verbose_name='Detalles')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='Dirección IP')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Fecha y hora')
    
    class Meta:
        verbose_name = 'Log de Auditoría'
        verbose_name_plural = 'Logs de Auditoría'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['usuario', 'timestamp']),
            models.Index(fields=['modelo', 'objeto_id']),
        ]
    
    def __str__(self):
        return f"{self.get_accion_display()} - {self.modelo} - {self.usuario} - {self.timestamp}"



