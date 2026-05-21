from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import ContactFeedbackSerializer
from .telegram_notify import send_telegram_message


def health_check(request):
    """Railway health probe — DRF/CSRF dan tashqari, tez 200."""
    return JsonResponse({'status': 'ok'})


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
