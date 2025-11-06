from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]



