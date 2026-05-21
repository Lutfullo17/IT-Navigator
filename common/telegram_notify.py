import json
import os
import urllib.error
import urllib.request

from django.conf import settings
from dotenv import load_dotenv


def _load_telegram_config():
    load_dotenv(settings.BASE_DIR / '.env', override=True)
    token = (
        os.environ.get('TELEGRAM_BOT_TOKEN', '')
        or getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
    ).strip()
    chat_id = (
        os.environ.get('TELEGRAM_CHAT_ID', '')
        or getattr(settings, 'TELEGRAM_CHAT_ID', '')
    ).strip()
    return token, chat_id


def send_telegram_message(text: str):
    token, chat_id = _load_telegram_config()

    if not token or not chat_id:
        return False, 'telegram_not_configured'

    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
    }).encode('utf-8')

    request = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            body = json.loads(response.read().decode('utf-8'))
            if body.get('ok'):
                return True, None
            return False, 'telegram_api_error'
    except urllib.error.HTTPError:
        return False, 'telegram_api_error'
    except urllib.error.URLError:
        return False, 'telegram_network_error'
