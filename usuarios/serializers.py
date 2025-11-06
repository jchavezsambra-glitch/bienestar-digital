from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

Usuario = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'nombres', 'apellidos', 'rol', 'curso', 'rut', 'password', 'date_joined']
        read_only_fields = ['id', 'date_joined']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        usuario = Usuario.objects.create_user(**validated_data)
        if password:
            usuario.set_password(password)
            usuario.save()
        return usuario
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para incluir información del usuario en el token"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['rol'] = user.rol
        token['nombres'] = user.nombres
        token['apellidos'] = user.apellidos
        return token


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    """Serializer para registro de nuevos usuarios"""
    
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = Usuario
        fields = ['email', 'password', 'nombres', 'apellidos', 'rol', 'curso', 'rut']
    
    def create(self, validated_data):
        usuario = Usuario.objects.create_user(**validated_data)
        return usuario



