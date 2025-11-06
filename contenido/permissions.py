from rest_framework import permissions


class EsProfesorOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que permite:
    - Lectura a todos los usuarios autenticados
    - Escritura solo a profesores/administradores
    """
    
    def has_permission(self, request, view):
        # Permitir lectura a todos los usuarios autenticados
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        # Solo profesores pueden escribir
        return request.user.is_authenticated and request.user.es_profesor()



