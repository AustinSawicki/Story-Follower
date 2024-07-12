from rest_framework import generics
from ..models import Story, CharacterCard, Chapter
from ..serializers.story_serializers import StorySerializer, CharacterCardSerializer, ChapterSerializer
from rest_framework.permissions import IsAuthenticated

class StoryListCreate(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StoryDetail(generics.RetrieveAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Story.objects.filter(user=self.request.user)
    
class StoryUpdate(generics.UpdateAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Story.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()
    
class StoryDelete(generics.DestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Story.objects.filter(user=self.request.user)

class CharacterCardListCreate(generics.ListCreateAPIView):
    serializer_class = CharacterCardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.request)
        story_id = self.kwargs['story_id']
        return CharacterCard.objects.filter(story__id=story_id, story__user=self.request.user)
    
    def perform_create(self, serializer):
        story_id = self.kwargs['story_id']
        story = Story.objects.get(id=story_id, user=self.request.user)
        serializer.save(story=story)

class CharacterCardUpdate(generics.UpdateAPIView):
    serializer_class = CharacterCardSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return CharacterCard.objects.filter(story__id=story_id, story__user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save()

class CharacterCardDelete(generics.DestroyAPIView):
    serializer_class = CharacterCardSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return CharacterCard.objects.filter(story__id=story_id, story__user=self.request.user)


class ChapterListCreate(generics.ListCreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return Chapter.objects.filter(story__id=story_id, story__user=self.request.user)
    
    def perform_create(self, serializer):
        story_id = self.kwargs['story_id']
        story = Story.objects.get(id=story_id, user=self.request.user)
        serializer.save(story=story)

class ChapterUpdate(generics.UpdateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return Chapter.objects.filter(story__id=story_id, story__user=self.request.user)

class ChapterDelete(generics.DestroyAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return Chapter.objects.filter(story__id=story_id, story__user=self.request.user)