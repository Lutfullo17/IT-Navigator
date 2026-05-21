import re

from django.contrib.auth.models import User


def normalize_phone(phone):
    digits = re.sub(r'\D', '', str(phone))

    if digits.startswith('998') and len(digits) == 12:
        return digits

    if len(digits) == 9:
        return f'998{digits}'

    return digits


def is_valid_uz_phone(phone):
    normalized = normalize_phone(phone)
    return len(normalized) == 12 and normalized.startswith('998')


def phone_exists(phone):
    """Barcha formatlarda (+998 / 998) dublikatni topish."""
    normalized = normalize_phone(phone)
    if not normalized:
        return False

    if User.objects.filter(username=normalized).exists():
        return True

    for existing in Profile.objects.exclude(phone__isnull=True).exclude(phone='').values_list('phone', flat=True):
        if normalize_phone(existing) == normalized:
            return True

    return False
