from django.conf import settings
from django.http import FileResponse, HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ContactFeedbackSerializer
from .telegram_notify import send_telegram_message


def health_check(request):
    """DRF/CSRF dan tashqari, tez 200."""
    return JsonResponse({'status': 'ok'})


def spa_index(request):
    """React SPA — /register, /home va boshqa client route'lar."""
    index_path = settings.FRONTEND_DIST / 'index.html'
    if not index_path.is_file():
        return HttpResponse(
            'Frontend build topilmadi. cd frontend && npm run build',
            status=503,
            content_type='text/plain; charset=utf-8',
        )
    return FileResponse(index_path.open('rb'), content_type='text/html; charset=utf-8')


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_feedback(request):
    serializer = ContactFeedbackSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    name = serializer.validated_data['name'].strip()
    telegram = serializer.validated_data['telegram'].strip().lstrip('@')
    message = serializer.validated_data['message'].strip()

    text = (
        'Yangi xabar — IT Navigator\n\n'
        f'Ism: {name}\n'
        f'Telegram: @{telegram}\n\n'
        f'Xabar:\n{message}'
    )

    ok, error_code = send_telegram_message(text)
    if not ok:
        if error_code == 'telegram_not_configured':
            return Response(
                {'detail': 'telegram_not_configured'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        return Response(
            {'detail': 'telegram_send_failed'},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response({'ok': True}, status=status.HTTP_201_CREATED)
