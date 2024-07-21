import os
import shutil
from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from .models import Story, CharacterCard, CustomUser, Theme
import boto3
from django.conf import settings
from django.core.files.storage import default_storage

default_themes = [
    {"name": "autumn", "theme_default": "#DEB887", "theme_dark": "#CD853F", "button_default": "#A0522D", "button_dark": "#8B4513", "text_color": "#000000"},
    {"name": "beige", "theme_default": "#f5f5dc", "theme_dark": "#e5e5c2", "button_default": "#cd7f4f", "button_dark": "#a0522d", "text_color": "#000000"},
    {"name": "desert", "theme_default": "#EDC9AF", "theme_dark": "#C19A6B", "button_default": "#D2B48C", "button_dark": "#A0522D", "text_color": "#000000"},
    {"name": "forest", "theme_default": "#013220", "theme_dark": "#011d14", "button_default": "#026b34", "button_dark": "#014d23", "text_color": "#ffffff"},
    {"name": "galaxy", "theme_default": "#4B0082", "theme_dark": "#2C003E", "button_default": "#8A2BE2", "button_dark": "#6A0DAD", "text_color": "#FFFFFF"},
    {"name": "lavender", "theme_default": "#e6e6fa", "theme_dark": "#9370db", "button_default": "#dda0dd", "button_dark": "#8a2be2", "text_color": "#000000"},
    {"name": "midnight", "theme_default": "#2c3e50", "theme_dark": "#1a252f", "button_default": "#3498db", "button_dark": "#2980b9", "text_color": "#ffffff"},
    {"name": "ocean", "theme_default": "#b0e0e6", "theme_dark": "#4682b4", "button_default": "#5f9ea0", "button_dark": "#2e8b57", "text_color": "#000000"},
    {"name": "silver", "theme_default": "#c0c0c0", "theme_dark": "#a9a9a9", "button_default": "#888888", "button_dark": "#444444", "text_color": "#000000"},
    {"name": "sunset", "theme_default": "#ffcccb", "theme_dark": "#ff6347", "button_default": "#ff4500", "button_dark": "#dc143c", "text_color": "#000000"},
    {"name": "winter", "theme_default": "#B0E0E6", "theme_dark": "#4682B4", "button_default": "#5F9EA0", "button_dark": "#1C6EA4", "text_color": "#000000"},
]

@receiver(post_save, sender=CustomUser)
def create_default_themes(sender, instance, created, **kwargs):
    if created:
        for theme in default_themes:
            Theme.objects.create(user=instance, **theme)

@receiver(pre_delete, sender=Story)
def delete_story_images(sender, instance, **kwargs):
    # Delete story images
    print("DELETE STORY IMAGES")
    if instance.image:
        default_storage.delete(instance.image.name)
    if instance.banner:
        default_storage.delete(instance.banner.name)
    
    # Delete character images related to the story
    for character in instance.character_cards.all():
        if character.image:
            default_storage.delete(character.image.name)
    
    s3_client = boto3.client(
        's3',
        region_name=settings.AWS_S3_REGION_NAME,
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY,
    )

    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    prefix = f'story_images/{instance.id}/'

    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    if 'Contents' in response:
        for obj in response['Contents']:
            s3_client.delete_object(Bucket=bucket_name, Key=obj['Key'])

@receiver(pre_delete, sender=CharacterCard)
def delete_character_images(sender, instance, **kwargs):
    print("DELETE CHARACTER IMAGES")
    if instance.image:
        default_storage.delete(instance.image.name)
    
    # Check if the story folder should be deleted
    story_folder = os.path.join('media', 'story_images', str(instance.story.id), 'characters')
    if os.path.exists(story_folder) and not os.listdir(story_folder):
        shutil.rmtree(story_folder)

        