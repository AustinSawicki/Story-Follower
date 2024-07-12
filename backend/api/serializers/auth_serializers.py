from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # I want all usernames saved in the database to be lowercase
        validated_data['username'] = validated_data['username'].lower() 
        user = User.objects.create_user(**validated_data)
        return user
