from ..models import CustomUser
from rest_framework import serializers
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "theme"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # I want all usernames saved in the database to be lowercase
        validated_data['username'] = validated_data['username'].lower() 
        user = CustomUser.objects.create_user(**validated_data)
        return user

class UpdatePasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('new_password',)

    def update(self, instance, validated_data):
        instance.password = make_password(validated_data['new_password'])
        instance.save()
        return instance

class UpdateUsernameSerializer(serializers.ModelSerializer):
    username = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('username',)

    def update(self, instance, validated_data):
        instance.username = validated_data['username']
        instance.save()
        return instance
    
class UpdateThemeSerializer(serializers.ModelSerializer):
    theme = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('theme',)

    def update(self, instance, validated_data):
        instance.theme = validated_data['theme']
        instance.save()
        return instance