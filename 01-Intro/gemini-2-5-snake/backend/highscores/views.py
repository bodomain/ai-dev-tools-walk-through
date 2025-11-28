from rest_framework import generics
from .models import Score
from .serializers import ScoreSerializer


class ScoreListCreate(generics.ListCreateAPIView):
    """List top scores (descending) and allow creating a new score."""
    serializer_class = ScoreSerializer

    def get_queryset(self):
        # Limit to top 50 for listing, frontend will show top 10
        return Score.objects.order_by('-score', 'created_at')[:50]

