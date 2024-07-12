from django.db import models
from django.contrib.auth.models import User

def character_image_upload_path(instance, filename):
    return f'story_images/{instance.story.id}/characters/{filename}'

class Story(models.Model):
    user = models.ForeignKey(User, related_name='stories', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    banner = models.ImageField(upload_to='story_images/banners', blank=True, null=True)

    def __str__(self):
        return self.title

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