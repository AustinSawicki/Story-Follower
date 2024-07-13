from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..models import Chapter
from ..serializers.story_serializers import ChapterSerializer
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(
  api_key = os.getenv('OPENAI_API_KEY'),
  organization = os.getenv('OPENAI_ORGANIZATION'),
  project = os.getenv('OPENAI_PROJECT'),
)

@api_view(['PUT'])
def update_chapter(request, pk):
    try:
        chapter = Chapter.objects.get(pk=pk)
    except Chapter.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ChapterSerializer(chapter, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        if not chapter.short_description and chapter.description:
            # Generate short description using OpenAI API
            prompt = (
                f"Based on this description, {chapter.description}\n"
                "Give me a shorter description that summarizes the main points.\n"
                "It must be shorter than the provided description. I want the\n"
                "response to only be the shorter description and it must not exceed 125 characters."
            )
            print(prompt)
            try:
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                )

                short_description = response.choices[0].message.content
                chapter.short_description = short_description
                chapter.save()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)