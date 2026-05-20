import random

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import MotivationalMessage
from .serializers import MotivationalMessageSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def message_list(request):
    category = request.query_params.get('category')

    messages = MotivationalMessage.objects.filter(is_active=True)

    if category:
        messages = messages.filter(category=category)

    serializer = MotivationalMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def random_message(request):
    category = request.query_params.get('category')

    messages = MotivationalMessage.objects.filter(is_active=True)

    if category:
        messages = messages.filter(category=category)

    if not messages.exists():
        return Response({'detail': 'Xabar topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    message = random.choice(list(messages))
    serializer = MotivationalMessageSerializer(message)
    return Response(serializer.data)
