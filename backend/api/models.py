from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

def character_image_upload_path(instance, filename):
    return f'story_images/{instance.story.id}/characters/{filename}'

class CustomUser(AbstractUser):
    theme = models.CharField(max_length=100, default='beige')

    def __str__(self):
        return self.username

class Story(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='stories', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
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

class CharacterCard(models.Model):
    story = models.ForeignKey(Story, related_name='character_cards', on_delete=models.CASCADE)
    group = models.CharField(max_length=30)
    name = models.CharField(max_length=20)
    description = models.TextField()
    image = models.ImageField(upload_to=character_image_upload_path, blank=True, null=True)

    def __str__(self):
        return self.name

class Chapter(models.Model):
    story = models.ForeignKey(Story, related_name='chapters', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    short_description = models.CharField(max_length=255)

    def __str__(self):
        return self.title