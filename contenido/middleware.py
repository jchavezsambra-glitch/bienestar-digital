import logging
import time
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger('contenido')


class LoggingMiddleware(MiddlewareMixin):
    """Middleware personalizado para logging y monitoreo"""
    
    def process_request(self, request):
        """Registrar inicio de request"""
        request.start_time = time.time()
        logger.info(
            f"Request iniciado: {request.method} {request.path} - "
            f"Usuario: {request.user if hasattr(request, 'user') else 'Anónimo'} - "
            f"IP: {self.get_client_ip(request)}"
        )
    
    def process_response(self, request, response):
        """Registrar finalización de request"""
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            logger.info(
                f"Request completado: {request.method} {request.path} - "
                f"Status: {response.status_code} - "
                f"Duración: {duration:.2f}s"
            )
        return response
    
    def get_client_ip(self, request):
        """Obtener IP del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip



