from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from directions.constants import localize_results
from testsystem.models import TestSession
from tasks.models import MiniTask, UserTaskCompletion
from roadmap.content import ROADMAP_PLANS


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user

    tests_completed = TestSession.objects.filter(user=user, is_completed=True).count()
    tests_started = TestSession.objects.filter(user=user).count()

    tasks_completed = UserTaskCompletion.objects.filter(user=user, is_completed=True).count()
    tasks_total = MiniTask.objects.filter(is_active=True).count()

    roadmap_directions = len(ROADMAP_PLANS)

    tasks_liked = UserTaskCompletion.objects.filter(user=user, is_completed=True, liked=True).count()
    tasks_disliked = UserTaskCompletion.objects.filter(user=user, is_completed=True, liked=False).count()

    latest_test = (
        TestSession.objects.filter(user=user, is_completed=True)
        .order_by('-completed_at')
        .first()
    )

    profile = getattr(user, 'profile', None)
    language = profile.preferred_language if profile else 'uz'

    latest_results = (
        localize_results(latest_test.results, language=language)
        if latest_test and latest_test.results
        else []
    )

    return Response({
        'preferred_language': language,
        'onboarding_completed': profile.onboarding_completed if profile else False,
        'tests': {
            'started': tests_started,
            'completed': tests_completed,
            'latest_results': latest_results,
            'completed_at': latest_test.completed_at.isoformat() if latest_test and latest_test.completed_at else None,
        },
        'tasks': {
            'completed': tasks_completed,
            'total': tasks_total,
            'liked': tasks_liked,
            'disliked': tasks_disliked,
        },
        'roadmap': {
            'directions': roadmap_directions,
        },
    })
