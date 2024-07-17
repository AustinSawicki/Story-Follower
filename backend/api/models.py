from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.files.storage import default_storage
from django.db.models.signals import post_save
from django.dispatch import receiver

def character_image_upload_path(instance, filename):
    return f'story_images/{instance.story.id}/characters/{filename}'

class CustomUser(AbstractUser):
    theme = models.CharField(max_length=100, default='beige')

    def __str__(self):
        return self.username

class Theme(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='themes', on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    theme_default = models.CharField(max_length=7)
    theme_dark = models.CharField(max_length=7)
    button_default = models.CharField(max_length=7)
    button_dark = models.CharField(max_length=7)
    text_color = models.CharField(max_length=7)

    def __str__(self):
        return self.name

class Story(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='stories', on_delete=models.CASCADE)
    title = models.CharField(max_length=30)
    description = models.TextField(max_length=5000, default="About story...", blank=True)
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)
    banner = models.ImageField(upload_to='story_images/banners', blank=True, null=True)
    theme = models.CharField(max_length=100)
    sorting_enabled = models.BooleanField(default=True) 

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if not self.theme:  
            self.theme = self.user.theme  
        super().save(*args, **kwargs)
        if is_new:
            Affiliation.objects.create(story=self, name='Protagonist', color='#66ff00')
            Affiliation.objects.create(story=self, name='Antagonist', color='#EE4B2B')

    def delete(self, *args, **kwargs):
        if self.image:
            default_storage.delete(self.image.path)
        if self.banner:
            default_storage.delete(self.banner.path)
        super().delete(*args, **kwargs)

class Affiliation(models.Model):
    story = models.ForeignKey(Story, related_name='affiliations', on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    color = models.CharField(max_length=7)  # Assuming color is stored as a HEX value

    def __str__(self):
        return self.name

class CharacterCard(models.Model):
    story = models.ForeignKey(Story, related_name='character_cards', on_delete=models.CASCADE)
    affiliation = models.IntegerField(null=True, blank=True) 
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
    short_description = models.CharField(max_length=255)
    x = models.FloatField(default=0.0)  
    y = models.FloatField(default=0.0) 

    def __str__(self):
        return self.title
    
