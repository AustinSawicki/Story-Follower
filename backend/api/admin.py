from django.contrib import admin
from .models import Story, Chapter, CharacterCard

# Register your models here.
admin.site.register(Story)
admin.site.register(CharacterCard)
admin.site.register(Chapter)