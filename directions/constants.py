# Oddiy o'zbekcha yo'nalish nomlari — texnik inglizcha so'zlarsiz

DIRECTION_LABELS = {
    'frontend': 'Sayt ko\'rinishi',
    'backend': 'Ichki tizim',
    'data-analyst': 'Ma\'lumotlar tahlili',
    'ui-ux': 'Qulay dizayn',
    'mobile': 'Mobil ilovalar',
    'cybersecurity': 'Kiber xavfsizlik',
}

DIRECTION_LABELS_RU = {
    'frontend': 'Внешний вид сайта',
    'backend': 'Внутренние системы',
    'data-analyst': 'Анализ данных',
    'ui-ux': 'Удобный дизайн',
    'mobile': 'Мобильные приложения',
    'cybersecurity': 'Кибербезопасность',
}

DIRECTION_LABELS_EN = {
    'frontend': 'Website look & feel',
    'backend': 'Internal systems',
    'data-analyst': 'Data analysis',
    'ui-ux': 'Easy-to-use design',
    'mobile': 'Mobile apps',
    'cybersecurity': 'Cybersecurity',
}

DIRECTION_LABELS_BY_LANG = {
    'uz': DIRECTION_LABELS,
    'ru': DIRECTION_LABELS_RU,
    'en': DIRECTION_LABELS_EN,
}

DIRECTION_SIMPLE_DESC = {
    'frontend': 'Sayt va ilovaning chiroyli, ko\'rinadigan qismi',
    'backend': 'Sayt va ilovaning ichki, ko\'rinmaydigan qismi',
    'data-analyst': 'Raqamlar va jadvallardan foydali xulosa topish',
    'ui-ux': 'Ilovalarni odamlar uchun oson va qulay qilish',
    'mobile': 'Telefon uchun ilovalar yaratish',
    'cybersecurity': 'Telefon va kompyuterni firibgarlardan himoya qilish',
}

# Eski inglizcha nomlardan slug topish (bazada saqlangan test natijalari uchun)
LEGACY_NAME_TO_SLUG = {
    'frontend developer': 'frontend',
    'frontend': 'frontend',
    'backend developer': 'backend',
    'backend': 'backend',
    'data analyst': 'data-analyst',
    'ui/ux designer': 'ui-ux',
    'ui/ux': 'ui-ux',
    'mobile developer': 'mobile',
    'mobile': 'mobile',
    'cybersecurity': 'cybersecurity',
    'kiber xavfsizlik': 'cybersecurity',
}


def get_direction_label(slug, fallback='', language='uz'):
    labels = DIRECTION_LABELS_BY_LANG.get(language, DIRECTION_LABELS)
    return labels.get(slug, DIRECTION_LABELS.get(slug, fallback or slug))


def resolve_direction_slug(entry):
    slug = (entry.get('slug') or '').strip()
    if slug in DIRECTION_LABELS:
        return slug

    name = (entry.get('name') or '').strip().lower()
    for legacy, resolved in LEGACY_NAME_TO_SLUG.items():
        if legacy in name or name == legacy:
            return resolved

    return slug


def localize_results(results, language='uz'):
    """AI natijalaridagi nomlarni tanlangan tilga moslashtiradi."""
    if not isinstance(results, list):
        return results

    labels = DIRECTION_LABELS_BY_LANG.get(language, DIRECTION_LABELS)
    localized = []
    for item in results:
        entry = dict(item)
        slug = resolve_direction_slug(entry)
        if slug:
            entry['slug'] = slug
        if slug in labels:
            entry['name'] = labels[slug]
        localized.append(entry)
    return localized
