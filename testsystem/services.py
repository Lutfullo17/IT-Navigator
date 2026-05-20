import json
import os

from django.conf import settings
from groq import Groq


DIRECTIONS = [
    'frontend',
    'backend',
    'data-analyst',
    'ui-ux',
    'mobile',
    'cybersecurity',
]


def get_groq_client():
    api_key = getattr(settings, 'GROQ_API_KEY', os.environ.get('GROQ_API_KEY', ''))
    if not api_key:
        raise ValueError('GROQ_API_KEY topilmadi. settings.py yoki .env ga qo\'shing.')
    return Groq(api_key=api_key)


def _parse_json_response(text):
    text = text.strip()
    if text.startswith('```'):
        text = text.split('```')[1]
        if text.startswith('json'):
            text = text[4:]
    return json.loads(text.strip())


def generate_test_questions(count=15, language='uz'):
    client = get_groq_client()

    prompt = f"""
Sen IT yo'nalish tanlash platformasi uchun test savollari yaratuvchi assistantsan.

{count} ta savol yarat.
Til: {language}
Savollar oddiy, psixologik bosimsiz, beginner uchun tushunarli bo'lsin.

Har bir savol 2-4 ta javob variantiga ega bo'lsin.

Faqat JSON qaytar, boshqa matn yozma:
[
  {{
    "text": "savol matni",
    "options": ["variant 1", "variant 2", "variant 3"]
  }}
]
"""

    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.7,
    )

    content = response.choices[0].message.content
    return _parse_json_response(content)


def generate_recommendations(questions, answers, language='uz'):
    client = get_groq_client()

    qa_list = []
    for answer in answers:
        question = questions[answer['question_index']]
        qa_list.append({
            'savol': question['text'],
            'javob': answer['selected_option'],
        })

    prompt = f"""
Sen IT yo'nalish maslahatchisisan. Foydalanuvchi test javoblariga qarab mos yo'nalishlarni tavsiya qil.

Mavjud yo'nalishlar: {', '.join(DIRECTIONS)}

Javoblar:
{json.dumps(qa_list, ensure_ascii=False, indent=2)}

Qoidalar:
- Toxic bo'lma
- "Bu sizga emas" dema
- Oddiy tilda tushuntir
- Top 3 yo'nalish qaytar
- Til: {language}

Faqat JSON qaytar:
[
  {{
    "slug": "backend",
    "name": "Backend Developer",
    "percentage": 87,
    "reason": "nima uchun mos ekanligi"
  }}
]
"""

    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=[{'role': 'user', 'content': prompt}],
        temperature=0.5,
    )

    content = response.choices[0].message.content
    return _parse_json_response(content)
