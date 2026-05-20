from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ChatSession, ChatMessage
from .serializers import ChatSessionSerializer, SendMessageSerializer
from .services import get_mentor_reply


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_chat(request):
    session = ChatSession.objects.create(user=request.user)
    serializer = ChatSessionSerializer(session)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
    except ChatSession.DoesNotExist:
        return Response({'detail': 'Suhbat topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SendMessageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user_message = serializer.validated_data['message']
    language = serializer.validated_data['language']

    ChatMessage.objects.create(
        session=session,
        role='user',
        content=user_message,
    )

    history = session.messages.all()
    messages_for_ai = [
        {'role': msg.role, 'content': msg.content}
        for msg in history
    ]

    try:
        ai_reply = get_mentor_reply(messages_for_ai, language=language)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'detail': f'AI xatolik: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    ChatMessage.objects.create(
        session=session,
        role='assistant',
        content=ai_reply,
    )

    if not session.title:
        session.title = user_message[:50]
    session.updated_at = timezone.now()
    session.save()

    return Response(ChatSessionSerializer(session).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_detail(request, session_id):
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
    except ChatSession.DoesNotExist:
        return Response({'detail': 'Suhbat topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ChatSessionSerializer(session)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_chats(request):
    sessions = ChatSession.objects.filter(user=request.user)
    serializer = ChatSessionSerializer(sessions, many=True)
    return Response(serializer.data)
