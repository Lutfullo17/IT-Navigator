from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Direction
from .serializers import DirectionSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def direction_list(request):
    directions = Direction.objects.filter(is_active=True)
    serializer = DirectionSerializer(directions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def direction_detail(request, slug):
    try:
        direction = Direction.objects.get(slug=slug, is_active=True)
    except Direction.DoesNotExist:
        return Response(
            {'detail': 'Yo\'nalish topilmadi'},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = DirectionSerializer(direction)
    return Response(serializer.data)
