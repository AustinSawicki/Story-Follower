from django.shortcuts import render
from ..models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers.auth_serializers import UserSerializer, UpdatePasswordSerializer, UpdateUsernameSerializer, UpdateThemeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # All usernames saved in the database are lowercase
        request.data['username'] = request.data.get('username', '').lower()
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)    
    
class UpdatePasswordView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdatePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UpdateUsernameView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdateUsernameSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UpdateThemeView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdateThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user