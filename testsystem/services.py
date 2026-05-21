import json

import os



from django.conf import settings

from groq import Groq



from directions.constants import DIRECTION_LABELS_BY_LANG, localize_results

from .questions import get_test_questions





DIRECTIONS = list(DIRECTION_LABELS_BY_LANG['uz'].keys())



LANGUAGE_RULES = {
    'uz': {
        'write_in': "Barcha matnlar (name, reason) faqat o'zbek tilida bo'lsin.",
        'no_english': "Inglizcha texnik so'zlar ISHLATMA.",
    },
    'ru': {
        'write_in': 'Все тексты (name, reason) только на русском языке.',
        'no_english': 'Не используй английские технические термины.',
    },
    'en': {
        'write_in': 'All text (name, reason) must be in English only.',
        'no_english': 'Use simple everyday English, avoid jargon.',
    },
}





def get_groq_client():

    api_key = getattr(settings, 'GROQ_API_KEY', os.environ.get('GROQ_API_KEY', ''))

    if not api_key:

        raise ValueError('GROQ_API_KEY topilmadi. Loyiha ildizidagi .env faylga qo\'shing.')

    return Groq(api_key=api_key)





def _parse_json_response(text):

    text = text.strip()

    if text.startswith('```'):

        text = text.split('```')[1]

        if text.startswith('json'):

            text = text[4:]

    return json.loads(text.strip())





def generate_test_questions(count=15, language='uz'):

    return get_test_questions(count)





def _direction_names_for_ai(language='uz'):
    labels = DIRECTION_LABELS_BY_LANG.get(language, DIRECTION_LABELS_BY_LANG['uz'])
    return '\n'.join(f'- {slug} -> {name}' for slug, name in labels.items())


def generate_recommendations(questions, answers, language='uz'):
    client = get_groq_client()
    lang = language if language in DIRECTION_LABELS_BY_LANG else 'uz'
    rules = LANGUAGE_RULES.get(lang, LANGUAGE_RULES['uz'])

    qa_list = []
    for answer in answers:
        question = questions[answer['question_index']]
        qa_list.append({
            'savol': question['text'],
            'javob': answer['selected_option'],
        })

    prompt = f"""
Sen IT yo'nalish maslahatchisisan. Foydalanuvchi test javoblariga qarab mos yo'nalishlarni tavsiya qil.

MUHIM: Foydalanuvchi IT haqida deyarli bilmaydi. Sabablarni oddiy tilda, kundalik hayot misollari bilan yoz.
{rules['no_english']}
{rules['write_in']}

Yo'nalish slug va nomlari FAQAT shular (name maydonida aynan shu nomni yoz):
{_direction_names_for_ai(lang)}

Javoblar:
{json.dumps(qa_list, ensure_ascii=False, indent=2)}

Qoidalar:
- Toxic bo'lma, "bu sizga emas" dema
- Top 3 yo'nalish qaytar
- slug — yuqoridagi slug lardan biri
- name — yuqoridagi nom bilan bir xil
- reason — 1-2 gap, tanlangan tilda

Faqat JSON qaytar:
[
  {{
    "slug": "backend",
    "name": "example",
    "percentage": 87,
    "reason": "why it fits"
  }}
]
"""



    response = client.chat.completions.create(

        model='llama-3.3-70b-versatile',

        messages=[{'role': 'user', 'content': prompt}],

        temperature=0.5,

    )



    content = response.choices[0].message.content

    results = _parse_json_response(content)

    return localize_results(results, language=lang)
