from rest_framework import serializers
from ..models import Story, CharacterCard, Chapter

class CharacterCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterCard
        fields = ['id', 'group', 'name', 'description', 'image']
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
            'group': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
        }

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'description', 'short_description']
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'short_description': {'required': False},
        }

class StorySerializer(serializers.ModelSerializer):
    character_cards = CharacterCardSerializer(many=True, read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'title', 'description', 'character_cards', 'chapters', 'image', 'banner']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': False},
            'character_cards': {'read_only': True},
            'chapters': {'read_only': True},
        }