from django.contrib import admin
from django.urls import path, include
from api.views.auth_views import CreateUserView, UserDetailView, CustomTokenObtainPairView, UpdatePasswordView, UpdateUsernameView, UpdateUserThemeView, UpdateUserSortOptionView, ThemeListCreate, ThemeDelete, ThemeDetail, ThemeUpdate
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/me/", UserDetailView.as_view(), name="user_detail"),
    path("api/user/update-password/", UpdatePasswordView.as_view(), name="update_password"),
    path("api/user/update-username/", UpdateUsernameView.as_view(), name="update_username"),
    path("api/user/update-user-theme/", UpdateUserThemeView.as_view(), name="update_user_theme"),
    path("api/user/update-sort-option/", UpdateUserSortOptionView.as_view(), name='update_sort_option'),
    path("api/user/themes/", ThemeListCreate.as_view(), name='theme-list-create'),
    path("api/user/themes/<int:id>/", ThemeDetail.as_view(), name='theme-detail'),
    path("api/user/themes/<int:id>/update/", ThemeUpdate.as_view(), name='theme-update'),
    path("api/user/themes/<int:id>/delete/", ThemeDelete.as_view(), name='theme-delete'),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
]  

if settings.DEBUG:
    # Serve media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Serve static files
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)