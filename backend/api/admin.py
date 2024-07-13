from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Story, Chapter, CharacterCard, CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('theme',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('theme',)}),
    )

# Register your models here.
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Story)
admin.site.register(CharacterCard)
admin.site.register(Chapter)