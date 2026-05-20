from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import TestSession, UserAnswer
from .serializers import TestSessionSerializer, SubmitAnswersSerializer
from .services import generate_test_questions, generate_recommendations


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_test(request):
    language = request.data.get('language', 'uz')
    question_count = request.data.get('count', 15)

    try:
        questions = generate_test_questions(count=question_count, language=language)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'detail': f'AI xatolik: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    session = TestSession.objects.create(
        user=request.user,
        questions=questions,
    )

    serializer = TestSessionSerializer(session)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answers(request, session_id):
    try:
        session = TestSession.objects.get(id=session_id, user=request.user)
    except TestSession.DoesNotExist:
        return Response({'detail': 'Test topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    if session.is_completed:
        return Response({'detail': 'Test allaqachon yakunlangan'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = SubmitAnswersSerializer(
        data=request.data,
        context={'session': session},
    )

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    answers_data = serializer.validated_data['answers']

    for answer in answers_data:
        index = answer['question_index']
        UserAnswer.objects.create(
            session=session,
            question_index=index,
            question_text=session.questions[index]['text'],
            selected_option=answer['selected_option'],
        )

    answers_for_ai = [
        {'question_index': a['question_index'], 'selected_option': a['selected_option']}
        for a in answers_data
    ]

    language = request.data.get('language', 'uz')

    try:
        results = generate_recommendations(session.questions, answers_for_ai, language=language)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'detail': f'AI xatolik: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    session.results = results
    session.is_completed = True
    session.completed_at = timezone.now()
    session.save()

    return Response(TestSessionSerializer(session).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_detail(request, session_id):
    try:
        session = TestSession.objects.get(id=session_id, user=request.user)
    except TestSession.DoesNotExist:
        return Response({'detail': 'Test topilmadi'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TestSessionSerializer(session)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tests(request):
    sessions = TestSession.objects.filter(user=request.user)
    serializer = TestSessionSerializer(sessions, many=True)
    return Response(serializer.data)
