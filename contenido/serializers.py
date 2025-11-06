from rest_framework import serializers
from .models import Carrera, Anuncio
from usuarios.serializers import UsuarioSerializer


class CarreraSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Carrera"""
    
    creado_por_info = UsuarioSerializer(source='creado_por', read_only=True)
    
    class Meta:
        model = Carrera
        fields = [
            'id', 'nombre', 'descripcion', 'universidad', 'duracion',
            'requisitos', 'campo_laboral', 'link_info', 'areas_interes',
            'habilidades_necesarias', 'creado_por', 'creado_por_info',
            'creado_en', 'actualizado_en', 'activo'
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en', 'creado_por']


class AnuncioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Anuncio"""
    
    creado_por_info = UsuarioSerializer(source='creado_por', read_only=True)
    esta_activo = serializers.SerializerMethodField()
    
    class Meta:
        model = Anuncio
        fields = [
            'id', 'titulo', 'contenido', 'tipo', 'link_zoom', 'link_encuesta',
            'link_recurso', 'creado_por', 'creado_por_info', 'creado_en',
            'actualizado_en', 'fecha_publicacion', 'fecha_expiracion',
            'activo', 'veces_visto', 'esta_activo'
        ]
        read_only_fields = ['id', 'creado_en', 'actualizado_en', 'creado_por', 'veces_visto']
    
    def get_esta_activo(self, obj):
        return obj.esta_activo()


class AnuncioCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear anuncios (sin campos de solo lectura)"""
    
    class Meta:
        model = Anuncio
        fields = [
            'titulo', 'contenido', 'tipo', 'link_zoom', 'link_encuesta',
            'link_recurso', 'fecha_publicacion', 'fecha_expiracion', 'activo'
        ]



