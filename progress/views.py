from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from testsystem.models import TestSession
from tasks.models import MiniTask, UserTaskCompletion
from roadmap.models import RoadmapStep, UserRoadmapProgress


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user

    tests_completed = TestSession.objects.filter(user=user, is_completed=True).count()
    tests_started = TestSession.objects.filter(user=user).count()

    tasks_completed = UserTaskCompletion.objects.filter(user=user, is_completed=True).count()
    tasks_total = MiniTask.objects.filter(is_active=True).count()

    roadmap_completed = UserRoadmapProgress.objects.filter(user=user, is_completed=True).count()
    roadmap_total = RoadmapStep.objects.filter(is_active=True).count()

    tasks_liked = UserTaskCompletion.objects.filter(user=user, is_completed=True, liked=True).count()
    tasks_disliked = UserTaskCompletion.objects.filter(user=user, is_completed=True, liked=False).count()

    latest_test = TestSession.objects.filter(user=user, is_completed=True).first()

    profile = getattr(user, 'profile', None)

    return Response({
        'onboarding_completed': profile.onboarding_completed if profile else False,
        'tests': {
            'started': tests_started,
            'completed': tests_completed,
            'latest_results': latest_test.results if latest_test else [],
        },
        'tasks': {
            'completed': tasks_completed,
            'total': tasks_total,
            'liked': tasks_liked,
            'disliked': tasks_disliked,
        },
        'roadmap': {
            'completed': roadmap_completed,
            'total': roadmap_total,
        },
    })
