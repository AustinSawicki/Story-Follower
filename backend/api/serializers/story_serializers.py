from rest_framework import serializers
from ..models import Story, CharacterCard, Chapter, Affiliation

class AffiliationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Affiliation
        fields = ['id', 'story', 'name', 'color']

class CharacterCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterCard
        fields = ['id', 'affiliation', 'name', 'description', 'image']
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': True},
            'affiliation': {'required': False},
            'description': {'required': False, 'allow_blank': True},
        }

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'title', 'description', 'short_description', 'x', 'y']
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'short_description': {'required': False, 'allow_blank': True},
            'x': {'required': False},
            'y': {'required': False},
        }

class StorySerializer(serializers.ModelSerializer):
    character_cards = CharacterCardSerializer(many=True, read_only=True)
    chapters = ChapterSerializer(many=True, read_only=True)
    affiliations = AffiliationSerializer(many=True,read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'title', 'description', 'character_cards', 'chapters', 'image', 'banner', 'theme', 'affiliations', 'sorting_enabled']
        extra_kwargs = {
            'title': {'required': True},
            'description': {'required': False},
            'theme': {'required': False},
            'affiliations': {'read_only': True},
            'character_cards': {'read_only': True},
            'chapters': {'read_only': True},
        }