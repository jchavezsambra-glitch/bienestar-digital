from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Carrera, Anuncio, LogAuditoria
from .serializers import CarreraSerializer, AnuncioSerializer, AnuncioCreateSerializer
from .permissions import EsProfesorOrReadOnly


class CarreraViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de carreras"""
    
    queryset = Carrera.objects.filter(activo=True)
    serializer_class = CarreraSerializer
    permission_classes = [EsProfesorOrReadOnly]
    
    def get_queryset(self):
        """Filtrar solo carreras activas para estudiantes/apoderados"""
        queryset = Carrera.objects.all()
        if not self.request.user.es_profesor():
            queryset = queryset.filter(activo=True)
        return queryset
    
    def perform_create(self, serializer):
        """Asignar creador al crear carrera"""
        serializer.save(creado_por=self.request.user)
    
    def perform_update(self, serializer):
        """Registrar actualización en logs"""
        instance = serializer.save()
        LogAuditoria.objects.create(
            usuario=self.request.user,
            modelo='Carrera',
            objeto_id=str(instance.id),
            accion='UPDATE',
            detalles={'cambios': serializer.validated_data}
        )
    
    def perform_destroy(self, instance):
        """Soft delete - marcar como inactivo"""
        instance.activo = False
        instance.save()
        LogAuditoria.objects.create(
            usuario=self.request.user,
            modelo='Carrera',
            objeto_id=str(instance.id),
            accion='DELETE',
            detalles={'nombre': instance.nombre}
        )


class AnuncioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de anuncios"""
    
    queryset = Anuncio.objects.all()
    permission_classes = [EsProfesorOrReadOnly]
    
    def get_serializer_class(self):
        """Usar serializer diferente para crear"""
        if self.action == 'create':
            return AnuncioCreateSerializer
        return AnuncioSerializer
    
    def get_queryset(self):
        """Filtrar anuncios según rol y estado"""
        queryset = Anuncio.objects.all()
        
        # Estudiantes y apoderados solo ven anuncios activos
        if not self.request.user.es_profesor():
            queryset = queryset.filter(activo=True)
            # Filtrar por fechas de publicación/expiracion
            ahora = timezone.now()
            queryset = queryset.filter(
                fecha_publicacion__lte=ahora
            ).exclude(
                fecha_expiracion__lt=ahora
            )
        
        return queryset.order_by('-creado_en')
    
    def perform_create(self, serializer):
        """Asignar creador al crear anuncio"""
        anuncio = serializer.save(creado_por=self.request.user)
        LogAuditoria.objects.create(
            usuario=self.request.user,
            modelo='Anuncio',
            objeto_id=str(anuncio.id),
            accion='CREATE',
            detalles={'titulo': anuncio.titulo, 'tipo': anuncio.tipo}
        )
    
    def perform_update(self, serializer):
        """Registrar actualización en logs"""
        instance = serializer.save()
        LogAuditoria.objects.create(
            usuario=self.request.user,
            modelo='Anuncio',
            objeto_id=str(instance.id),
            accion='UPDATE',
            detalles={'cambios': serializer.validated_data}
        )
    
    def perform_destroy(self, instance):
        """Registrar eliminación en logs"""
        LogAuditoria.objects.create(
            usuario=self.request.user,
            modelo='Anuncio',
            objeto_id=str(instance.id),
            accion='DELETE',
            detalles={'titulo': instance.titulo}
        )
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def registrar_vista(self, request, pk=None):
        """Registrar que un usuario vio el anuncio"""
        anuncio = self.get_object()
        anuncio.incrementar_vistas()
        return Response({'message': 'Vista registrada', 'veces_visto': anuncio.veces_visto})
    
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Listar solo anuncios activos"""
        anuncios = self.get_queryset().filter(activo=True)
        serializer = self.get_serializer(anuncios, many=True)
        return Response(serializer.data)



