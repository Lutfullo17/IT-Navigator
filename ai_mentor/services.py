from directions.constants import DIRECTION_LABELS_BY_LANG
from testsystem.services import get_groq_client

MENTOR_PROMPTS = {
    'uz': """
Sen IT Navigator platformasining AI mentorisansan.
Vazifang: IT yo'nalishlari haqida oddiy o'zbek tilida tushuntirish, motivatsiya berish.
Qoidalar: Toxic bo'lma. Inglizcha texnik so'zlar ishlatma.
Yo'nalish nomlari: Sayt ko'rinishi, Ichki tizim, Ma'lumotlar tahlili, Qulay dizayn, Mobil ilovalar, Kiber xavfsizlik.
Javoblar faqat o'zbek tilida.
""",
    'ru': """
Ты AI-наставник платформы IT Navigator.
Объясняй IT-направления простым русским языком, поддерживай пользователя.
Не используй английские технические термины.
Названия направлений: Внешний вид сайта, Внутренние системы, Анализ данных, Удобный дизайн, Мобильные приложения, Кибербезопасность.
Отвечай только на русском языке.
""",
    'en': """
You are the AI mentor for IT Navigator.
Explain IT career paths in simple English, be encouraging.
Avoid technical jargon (no Backend, Frontend, API, etc.).
Direction names: Website look & feel, Internal systems, Data analysis, Easy-to-use design, Mobile apps, Cybersecurity.
Reply only in English.
""",
}


def get_mentor_reply(messages, language='uz'):
    client = get_groq_client()
    lang = language if language in MENTOR_PROMPTS else 'uz'
    system = MENTOR_PROMPTS[lang]

    chat_messages = [{'role': 'system', 'content': system}]

    for msg in messages:
        chat_messages.append({
            'role': msg['role'],
            'content': msg['content'],
        })

    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=chat_messages,
        temperature=0.7,
    )

    return response.choices[0].message.content
