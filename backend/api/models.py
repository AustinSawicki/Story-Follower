from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.files.storage import default_storage

def character_image_upload_path(instance, filename):
    return f'story_images/{instance.story.id}/characters/{filename}'

class CustomUser(AbstractUser):
    theme = models.CharField(max_length=100, default='beige')

    def __str__(self):
        return self.username

class Story(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='stories', on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    banner = models.ImageField(upload_to='story_images/banners', blank=True, null=True)
    theme = models.CharField(max_length=100, default='beige')

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.theme or self.theme == 'beige':  # Check if theme is not set or defaulted to 'beige'
            self.theme = self.user.theme  # Set the story's theme to the user's theme
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image:
            default_storage.delete(self.image.path)
        if self.banner:
            default_storage.delete(self.banner.path)
        super().delete(*args, **kwargs)

class CharacterCard(models.Model):
    story = models.ForeignKey(Story, related_name='character_cards', on_delete=models.CASCADE)
    group = models.CharField(max_length=30)
    name = models.CharField(max_length=20)
    description = models.TextField()
    image = models.ImageField(upload_to=character_image_upload_path, blank=True, null=True)

    def __str__(self):
        return self.name
    
    def delete(self, *args, **kwargs):
        if self.image:
            default_storage.delete(self.image.path)
        super().delete(*args, **kwargs)

class Chapter(models.Model):
    story = models.ForeignKey(Story, related_name='chapters', on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    description = models.TextField()
    short_description = models.CharField(max_length=125)
    x = models.FloatField(default=0.0)  
    y = models.FloatField(default=0.0) 

    def __str__(self):
        return self.title