from django.urls import path
from .views.story_views import StoryListCreate, StoryDetail, StoryUpdate, StoryDelete, CharacterCardListCreate, CharacterCardUpdate, CharacterCardDelete, ChapterListCreate, ChapterUpdate, ChapterDelete, AffiliationListCreateView, AffiliationDeleteView, AffiliationUpdateView
from .views.external_views import update_chapter

urlpatterns = [
    path('stories/', StoryListCreate.as_view(), name='story-list-create'),
    path('stories/<int:id>/', StoryDetail.as_view(), name='story-detail'),
    path('stories/<int:id>/update/', StoryUpdate.as_view(), name='story-update'),
    path('stories/<int:id>/delete/', StoryDelete.as_view(), name='story-delete'),
    path('stories/<int:story_id>/affiliations/', AffiliationListCreateView.as_view(), name='affiliation-list-create'),
    path('stories/<int:story_id>/affiliations/<int:id>/update/', AffiliationUpdateView.as_view(), name='affiliation-update'),
    path('stories/<int:story_id>/affiliations/<int:id>/delete/', AffiliationDeleteView.as_view(), name='affiliation-delete'),
    path('stories/<int:story_id>/characters/', CharacterCardListCreate.as_view(), name='character-card-list-create'),
    path('stories/<int:story_id>/characters/<int:id>/update/', CharacterCardUpdate.as_view(), name='character-update'),
    path('stories/<int:story_id>/characters/<int:id>/delete/', CharacterCardDelete.as_view(), name='character-card-delete'),
    path('stories/<int:story_id>/chapters/', ChapterListCreate.as_view(), name='chapter-list-create'),
    path('stories/<int:story_id>/chapters/<int:id>/update/', ChapterUpdate.as_view(), name='chapter-update'),
    path('stories/<int:story_id>/chapters/<int:id>/delete/', ChapterDelete.as_view(), name='chapter-delete'),
    path('stories/chapters/<int:pk>/', update_chapter, name='update_chapter'),
]