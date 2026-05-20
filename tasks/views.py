from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import MiniTask, UserTaskCompletion
from .serializers import MiniTaskSerializer, CompleteTaskSerializer, UserTaskCompletionSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_list(request):
    direction_slug = request.query_params.get('direction')

    if not direction_slug:
        return Response([])

    tasks = MiniTask.objects.filter(
        is_active=True,
        direction__slug=direction_slug,
        direction__is_active=True,
    )

    serializer = MiniTaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_detail(request, task_id):
    try:
        task = MiniTask.objects.get(id=task_id, is_active=True)
    except MiniTask.DoesNotExist:
        return Response({'detail': 'Mashq topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    serializer = MiniTaskSerializer(task)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_task(request, task_id):
    try:
        task = MiniTask.objects.get(id=task_id, is_active=True)
    except MiniTask.DoesNotExist:
        return Response({'detail': 'Mashq topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CompleteTaskSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    completion, _ = UserTaskCompletion.objects.update_or_create(
        user=request.user,
        task=task,
        defaults={
            'is_completed': True,
            'liked': serializer.validated_data['liked'],
            'completed_at': timezone.now(),
        },
    )

    return Response(UserTaskCompletionSerializer(completion).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_completions(request):
    completions = UserTaskCompletion.objects.filter(
        user=request.user,
        is_completed=True,
    )
    serializer = UserTaskCompletionSerializer(completions, many=True)
    return Response(serializer.data)
