from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import RoadmapStep, UserRoadmapProgress
from .serializers import RoadmapStepSerializer, UserRoadmapProgressSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def roadmap_list(request):
    direction_slug = request.query_params.get('direction')

    steps = RoadmapStep.objects.filter(is_active=True)

    if direction_slug:
        steps = steps.filter(direction__slug=direction_slug, direction__is_active=True)

    serializer = RoadmapStepSerializer(steps, many=True, context={'user': request.user})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_step(request, step_id):
    try:
        step = RoadmapStep.objects.get(id=step_id, is_active=True)
    except RoadmapStep.DoesNotExist:
        return Response({'detail': 'Bosqich topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    progress, _ = UserRoadmapProgress.objects.update_or_create(
        user=request.user,
        step=step,
        defaults={
            'is_completed': True,
            'completed_at': timezone.now(),
        },
    )

    return Response(UserRoadmapProgressSerializer(progress).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_progress(request):
    progress = UserRoadmapProgress.objects.filter(
        user=request.user,
        is_completed=True,
    )
    serializer = UserRoadmapProgressSerializer(progress, many=True)
    return Response(serializer.data)
