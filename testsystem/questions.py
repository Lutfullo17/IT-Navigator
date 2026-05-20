# Oddiy, kundalik hayot savollari — IT bilimi talab qilinmaydi
# AI faqat natija tavsiyasi uchun ishlatiladi

SIMPLE_QUESTIONS = [
    {
        'text': 'Quyidagi sohalardan aynan qaysi biri sizni ko\'proq qiziqtiradi?',
        'options': [
            'Kompyuter va telefon bilan ishlash',
            'Rasm chizish va dizayn',
            'Raqamlar va statistika',
            'Odamlar bilan muloqot qilish',
        ],
    },
    {
        'text': 'Maktab davrida siz uchun qaysi fanlarni o\'zlashtirish oson bo\'lgan?',
        'options': [
            'Matematika va fizika',
            'Chizmachilik va san\'at',
            'Ona tili va adabiyot',
            'Biologiya va tabiat fanlari',
        ],
    },
    {
        'text': 'Sizga ko\'proq yoqadi:',
        'options': [
            'Masalalarni yechish va mantiq bilan ishlash',
            'Yangi narsalarni ixtiro qilish, tajriba o\'tkazish',
            'Ijodiy ishlar, tasavvur bilan yaratish',
            'Kompyuter o\'yinlari va texnologiyalarni sinab ko\'rish',
        ],
    },
    {
        'text': 'Bo\'sh vaqtingizni ko\'proq qayerga sarflaysiz?',
        'options': [
            'Shahar bo\'ylab sayr qilish, yangi joylarni ko\'rish',
            'Ilgari bilmagan yangi narsalarni o\'rganish',
            'Rasm chizish, film yoki video tomosha qilish',
            'Do\'stlar bilan muloqot, ijtimoiy tarmoqlar',
        ],
    },
    {
        'text': 'Agar sizda katta miqdorda pul bo\'lsa, uni nimaga sarflaysiz?',
        'options': [
            'Ish uchun yangi kompyuter',
            'Yangi kiyim yoki aksessuarlar',
            'Uyingizni zamonaviy ta\'mirlash',
            'Eng yangi model telefon',
        ],
    },
    {
        'text': 'Siz uchun quyidagilar bilan ishlash osonroq:',
        'options': [
            'Raqamlar va jadvallar',
            'Odamlar bilan',
            'Ranglar va dizayn',
            'Turli dasturlar va ilovalar',
        ],
    },
    {
        'text': 'Siz uchun muhimroq:',
        'options': [
            'Zamonaviy, istiqbolli kasbga ega bo\'lish',
            'Ijodkorlik bilan bog\'liq qiziqarli ish',
            'Mehnat bozorida doim talab qilinadigan mutaxassis bo\'lish',
        ],
    },
    {
        'text': 'Sizning kuchli tomonlaringiz:',
        'options': [
            'Mantiq, har qanday vaziyatdan chiqib keta olish',
            'Ijodkorlik, g\'ayrioddiy fikrlash',
            'Tez o\'rganish va kelishuvga kelish',
        ],
    },
    {
        'text': 'Siz ko\'proq qaysi biri?',
        'options': [
            'Ijodiy odam',
            'Mantiq bilan ishlaydigan odam',
            'Har xil ish qo\'ldan keladi',
        ],
    },
    {
        'text': 'Sizga sovg\'a berishganda, nimaga ko\'proq e\'tibor berasiz?',
        'options': [
            'Sovg\'aning tashqi ko\'rinishi',
            'Ichida nima borligi qiziq',
            'Ushbu sovg\'ani qanday ishlatish mumkin',
        ],
    },
    {
        'text': 'Qanday ma\'lumotni yaxshiroq eslab qolasiz?',
        'options': [
            'Rasmlar, tasvirlar va ranglar yordamida',
            'Ma\'lumotning mantiqini tushungan holda',
        ],
    },
    {
        'text': 'Yangi ishga kirganingizda, qaysi vazifani tanlaysiz?',
        'options': [
            'Innovatsion va kreativ g\'oyalar',
            'Texnik qism bilan ishlash',
            'Kompaniyani tanitish va muloqot',
        ],
    },
    {
        'text': 'Ishga kech qolganingizda, keyingi harakatingiz:',
        'options': [
            'Qolgan vaqtni hisoblab, shoshilaman',
            'Eng yaqin yo\'lni qidiraman',
            'Nima uchun kech qolganim haqida o\'ylayman',
            'Shoshilmasdan, atrofni kuzataman',
        ],
    },
    {
        'text': 'Yangi telefon sotib olmoqchi bo\'lsangiz:',
        'options': [
            'Texnik xususiyatlarni diqqat bilan o\'rganaman',
            'Video sharhlarni tomosha qilaman',
            'Do\'stlar va tanishlardan so\'rayman',
            'Eng chiroyli modelni tanlayman',
        ],
    },
    {
        'text': 'Konsertga borsangiz, e\'tiboringizni ko\'proq nima jalb qiladi?',
        'options': [
            'Kostyumlar, bezaklar, dizayn',
            'Sahnaning texnik ko\'rinishi',
            'Turli effektlar va yorug\'lik',
            'Atrofdagi odamlar',
        ],
    },
]


def get_test_questions(count=None):
    questions = SIMPLE_QUESTIONS.copy()
    if count and count < len(questions):
        return questions[:count]
    return questions
