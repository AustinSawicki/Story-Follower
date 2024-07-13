import os
import shutil
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Story, CharacterCard
from django.core.files.storage import default_storage

@receiver(pre_delete, sender=Story)
def delete_story_images(sender, instance, **kwargs):
    # Delete story images
    if instance.image:
        default_storage.delete(instance.image.path)
    if instance.banner:
        default_storage.delete(instance.banner.path)
    
    # Delete character images related to the story
    character_image_paths = []
    for character in instance.character_cards.all():
        if character.image:
            character_image_paths.append(character.image.path)
            default_storage.delete(character.image.path)
    
    # Remove the directory if it exists
    story_folder = os.path.join('media', 'story_images', str(instance.id))
    if os.path.exists(story_folder) and not os.listdir(story_folder):
        shutil.rmtree(story_folder)

@receiver(pre_delete, sender=CharacterCard)
def delete_character_images(sender, instance, **kwargs):
    if instance.image:
        default_storage.delete(instance.image.path)
    
    # Check if the story folder should be deleted
    story_folder = os.path.join('media', 'story_images', str(instance.story.id), 'characters')
    if os.path.exists(story_folder) and not os.listdir(story_folder):
        shutil.rmtree(story_folder)