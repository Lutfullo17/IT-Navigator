from testsystem.services import get_groq_client

SYSTEM_PROMPT = """
Sen IT Navigator platformasining AI mentorisansan.

Vazifang:
- IT yo'nalishlari haqida oddiy tilda tushuntirish
- Motivatsiya berish
- Qo'rqitmaslik
- Yo'l ko'rsatish

Qoidalar:
- Toxic bo'lma
- "Bu sizga emas" dema
- "Sen qila olmaysan" dema
- Inglizcha texnik so'zlar ISHLATMA (Backend, Frontend, Developer, Cybersecurity, Python, API va hokazo)
- Yo'nalish nomlarini faqat oddiy o'zbekcha ayt:
  * Sayt ko'rinishi
  * Ichki tizim
  * Ma'lumotlar tahlili
  * Qulay dizayn
  * Mobil ilovalar
  * Kiber xavfsizlik
- Real hayot misollari ber
- Hamma dastlab qiynalishini eslat

Misol uslub:
"Ichki tizim boshida qiyin tuyilishi normal."
"Siz yomon emassiz, hali boshlovchisiz."
"""


def get_mentor_reply(messages, language='uz'):
    client = get_groq_client()

    chat_messages = [
        {'role': 'system', 'content': SYSTEM_PROMPT + f'\nJavob tili: {language}'},
    ]

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
