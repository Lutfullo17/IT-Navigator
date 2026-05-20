from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from directions.constants import get_direction_label
from directions.models import Direction
from .content import ROADMAP_PLANS


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def roadmap_plan(request):
    direction_slug = request.query_params.get('direction')

    if not direction_slug:
        return Response(
            {'detail': 'direction parametri kerak'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    plan = ROADMAP_PLANS.get(direction_slug)
    if not plan:
        return Response(
            {'detail': 'Bu yo\'nalish uchun reja topilmadi'},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        direction = Direction.objects.get(slug=direction_slug, is_active=True)
    except Direction.DoesNotExist:
        return Response(
            {'detail': 'Yo\'nalish topilmadi'},
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response({
        'slug': direction.slug,
        'name': get_direction_label(direction.slug, direction.name),
        'short_description': direction.short_description,
        'difficulty': direction.difficulty,
        'what_you_learn': direction.what_you_learn,
        'job_market': direction.job_market,
        'real_life_example': direction.real_life_example,
        'who_is_it_for': direction.who_is_it_for,
        'sections': plan['sections'],
        'google_query': plan['google_query'],
        'youtube_query': plan['youtube_query'],
    })
