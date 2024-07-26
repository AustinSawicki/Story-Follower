from django.shortcuts import render
from ..models import CustomUser, Theme
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers.auth_serializers import UserSerializer, UpdatePasswordSerializer, UpdateUsernameSerializer, UpdateUserThemeSerializer, UpdateUserSortOptionSerializer, ThemeSerializer
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
    
class UpdateUserThemeView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdateUserThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UpdateUserSortOptionView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UpdateUserSortOptionSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class ThemeListCreate(generics.ListCreateAPIView):
    serializer_class = ThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Theme.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ThemeDetail(generics.RetrieveAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Theme.objects.get(pk=self.kwargs['id'], user=self.request.user)

class ThemeUpdate(generics.UpdateAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Theme.objects.get(pk=self.kwargs['id'], user=self.request.user)

class ThemeDelete(generics.DestroyAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Theme.objects.get(pk=self.kwargs['id'], user=self.request.user)