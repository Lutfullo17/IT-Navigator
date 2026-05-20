import json

import os



from django.conf import settings

from groq import Groq



from directions.constants import DIRECTION_LABELS, localize_results

from .questions import get_test_questions





DIRECTIONS = list(DIRECTION_LABELS.keys())



DIRECTION_NAMES_FOR_AI = '\n'.join(

    f'- {slug} -> {name}'

    for slug, name in DIRECTION_LABELS.items()

)





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



MUHIM: Foydalanuvchi IT haqida deyarli bilmaydi. Sabablarni oddiy tilda, kundalik hayot misollari bilan yoz.

Inglizcha texnik so'zlar ISHLATMA (Backend, Frontend, Developer, Analyst, Cybersecurity va hokazo).



Yo'nalish slug va nomlari FAQAT shular (name maydonida aynan shu o'zbek nomni yoz):

{DIRECTION_NAMES_FOR_AI}



Javoblar:

{json.dumps(qa_list, ensure_ascii=False, indent=2)}



Qoidalar:

- Toxic bo'lma, "bu sizga emas" dema

- Top 3 yo'nalish qaytar

- slug — yuqoridagi slug lardan biri

- name — yuqoridagi o'zbek nom bilan bir xil

- reason — 1-2 gap, oddiy o'zbek tilida

- Til: {language}



Faqat JSON qaytar:

[

  {{

    "slug": "backend",

    "name": "Ichki tizim",

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

    results = _parse_json_response(content)

    return localize_results(results)
