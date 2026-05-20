# Har bir yo'nalish uchun 10 ta oddiy hayotiy mashq

MINI_TASKS = []

_DIRECTION_TASKS = {
    'frontend': [
        ('Do\'kon vitrinasi', 'Odamlar ko\'radigan qism — chiroyli va tushunarli bo\'lishi kerak.', 'Kiyim do\'koni ochsangiz, vitrinada nimalarni birinchi qo\'yasiz? 3 ta narsa yozing.'),
        ('Telefon galereyasi', 'Rasmlarni chiroyli tartibda ko\'rsatish muhim.', '10 ta rasmni do\'stingizga ko\'rsatmoqchisiz — qanday 2 ta qoida qo\'yasiz?'),
        ('Instagram post', 'Post qanday ko\'rinishi odamlarni jalb qiladi.', 'Do\'stingiz tug\'ilgan kun posti uchun qanday rang va joylashuv tanlaysiz?'),
        ('Menyu dizayni', 'Ro\'yxatni o\'qish oson bo\'lishi kerak.', 'Kafe menyusida taomlar qanday tartibda yozilsa tushunarli bo\'ladi?'),
        ('Xona joylashuvi', 'Nima qayerda turishi qulay.', 'Xonangizda mebel qanday joylashtirilgan — nima birinchi ko\'rinadi?'),
        ('Kiyim kombinatsiyasi', 'Ranglar bir-biriga mos kelishi.', 'Bugungi kiyimingizda qaysi 2 ta rang bor va nega mos keladi?'),
        ('Tablo yaratish', 'Muhim ma\'lumot ko\'zga tashlansin.', 'Sinfdagi jadval qanday bo\'lsa o\'qish oson — 3 ta fikr.'),
        ('Reklama varaqasi', 'Birinchi qarab nima tushunish kerak.', 'Sotuv eloni yozsangiz — eng katta 3 ta matn qanday bo\'ladi?'),
        ('Telefon ekrani', 'Ilova ochganda nima ko\'rasiz.', 'Telefoningizda eng ko\'p ishlatadigan 3 ta ilova qaysi va nega?'),
        ('Bayram bezagi', 'Bayramda ko\'z qanday ranglarni qidiradi.', 'Yangi yil bezaklarida qaysi ranglar ko\'proq — nima uchun?'),
    ],
    'backend': [
        ('Do\'stga pul eslatmasi', 'Ma\'lumot saqlash va vaqtida eslatish.', 'Do\'stingiz 50 ming qarz — qachon va qanday eslatasiz? 3 ta qadam.'),
        ('Restoran buyurtmasi', 'Qaysi ma\'lumot kerak, qaysi biri yo\'q.', 'Onlayn buyurtmada mijozdan kamida 5 ta ma\'lumot oling.'),
        ('Kutubxona ro\'yxati', 'Kim nima olganini bilish kerak.', 'Do\'stlar kitob olsa — qanday ro\'yxat yuritasiz?'),
        ('Navbat tizimi', 'Kim oldin, kim keyin — adolatli bo\'lishi kerak.', 'Poliklinikada navbat qanday ishlashi kerak? 4 ta qoida.'),
        ('Ombor hisobi', 'Nima bor, nima tugagan.', 'Uyda oziq-ovqat qanday hisoblab borasiz?'),
        ('Tug\'ilgan kun eslatmasi', 'Sanani unutmaslik uchun tizim.', 'Oilangiz tug\'ilgan kunlarini qanday eslab qolasiz?'),
        ('Avtobus jadvali', 'Vaqt va yo\'nalish aniq bo\'lishi kerak.', 'Maktabga borish uchun qaysi vaqtda chiqish kerak — hisoblab yozing.'),
        ('Xarajat bo\'limi', 'Pul qayerga ketganini bilish.', 'Oylik pulingizni 4 ta toifaga bo\'ling — qanday?'),
        ('Uy vazifasi jadvali', 'Kim qachon nima qiladi.', 'Haftalik uy ishlarini qanday taqsimlaysiz?'),
        ('Do\'konda chegirma', 'Qaysi mahsulot qachon arzon.', 'Chegirma qoidalarini sodda 3 ta jumla bilan yozing.'),
    ],
    'data-analyst': [
        ('Oylik xarajatlar', 'Raqamlarni solishtirish va xulosa.', '3 oy xarajatlaringizni taxmin qiling — qaysi oy ko\'p?'),
        ('Do\'stlar so\'rovnomasi', 'Sonlardan eng mashhurini topish.', '10 do\'st: 4 yugurish, 3 suzish, 2 velo, 1 yoga — eng ko\'p qaysi?'),
        ('Sinf baholari', 'O\'rtacha va eng yaxshi fan.', '5 fan bahongiz bor — qaysi biri eng yuqori, qaysi biri eng past?'),
        ('Do\'kon savdosi', 'Qaysi mahsulot ko\'p sotilgan.', 'Kunlik savdo: 20 non, 15 sut, 8 shokolad — eng ko\'p qaysi?'),
        ('Ob-havo kuzatuvi', 'Qaysi hafta issiqroq bo\'lgan.', '5 kun harorat: 30, 32, 28, 35, 31 — eng issiq qaysi kun?'),
        ('Sport natijalari', 'Kim tezroq yugurgan.', '3 do\'st vaqti: 12 daq, 15 daq, 11 daq — eng tez kim?'),
        ('Telefon sarfi', 'Qaysi ilova ko\'p vaqt oladi.', 'Kunlik 4 soat telefon — qaysi 2 ta ilova eng ko\'p?'),
        ('Oila byudjeti', 'Daromad va xarajat farqi.', 'Oylik 2 mln kirim, 1.5 mln chiqim — qancha qoladi?'),
        ('Maktab davomati', 'Nechta kun kelgan, nechta qolgan.', 'Oyda 20 kun dars, 18 kun borgan — foizi qancha?'),
        ('Sevimli taomlar', 'Eng ko\'p tanlangan ovqat.', '7 kishidan so\'rov: 3 osh, 2 lag\'mon, 2 manti — eng mashhur?'),
    ],
    'ui-ux': [
        ('Qaysi ilova qulayroq?', 'Qulaylik haqida fikr bildirish.', '2 ta ilovadan qaysi osonroq — 3 ta sabab yozing.'),
        ('Bobom uchun ilova', 'Boshqalar o\'rniga o\'ylash.', 'Katta yoshli odamlar uchun 5 ta qulaylik fikri.'),
        ('Bolalar uchun sayt', 'Oddiy va xavfsiz bo\'lishi kerak.', '7 yoshli bola uchun saytda nima bo\'lmasligi kerak? 3 ta.'),
        ('Bank ilovasi', 'Pul o\'tkazishda nima muhim.', 'Pul yuborishda qaysi 3 ta narsa aniq ko\'rinishi kerak?'),
        ('Maktab dasturi', 'Ota-ona va o\'quvchi uchun qulay.', 'Baho ko\'rish ilovasi qanday bo\'lsa yaxshi — 4 ta fikr.'),
        ('Do\'kon ilovasi', 'Buyurtma berish oson bo\'lsin.', 'Ovqat buyurtmasida qaysi tugma katta bo\'lishi kerak?'),
        ('Avtobus ilovasi', 'Marshrut tushunarli bo\'lsin.', 'Avtobus qachon kelishini qanday ko\'rsatsa tushunarli?'),
        ('Kiyim sayti', 'O\'lcham tanlash oson bo\'lsin.', 'Kiyim sotib olganda qanday 3 ta yordam kerak?'),
        ('Shifokor qabul', 'Navbat olish qiyin bo\'lmasin.', 'Shifokorga yozilishda qaysi 2 ta qadam ortiqcha?'),
        ('Musiqa ilovasi', 'Qidirish va tinglash oson.', 'Sevimli qo\'shiqni topish uchun qanday qidiruv qulay?'),
    ],
    'mobile': [
        ('Telefon bilan nima qildim?', 'Kundalik hayotda telefon qayerda yordam beradi.', 'Bugun telefon bilan 5 ta ish — ro\'yxat tuzing.'),
        ('O\'z ilovam g\'oyasi', 'Amaliy foydali g\'oya.', 'Do\'stlaringiz bilan foydalanadigan ilova — nima qiladi?'),
        ('Ona-ota ilovasi', 'Oilada aloqa uchun.', 'Oilangiz uchun qanday ilova kerak bo\'lardi? 3 ta vazifa.'),
        ('O\'qish ilovasi', 'Darslarni eslab qolish.', 'Imtihonga tayyorlanish ilovasi qanday yordam bersin?'),
        ('Sport ilovasi', 'Mashq qilishni kuzatish.', 'Kunlik yurishni hisoblovchi ilova qanday ishlashi kerak?'),
        ('Xarajat ilovasi', 'Pul sarflashni nazorat.', 'Harajat yozadigan ilovada qaysi 3 ta tugma bo\'lsin?'),
        ('Sayohat ilovasi', 'Yangi shaharda yo\'l topish.', 'Toshkentda mehmon bo\'lsangiz qanday ilova kerak?'),
        ('Ovqat ilovasi', 'Nima pishirishni tanlash.', 'Uyda ovqat qilishga qanday ilova yordam bersin?'),
        ('Do\'stlar ilovasi', 'Uchrashuv rejalashtirish.', 'Do\'stlar uchrashuvini rejalashtirish ilovasi qanday bo\'lsin?'),
        ('Xavfsizlik ilovasi', 'Favqulodda yordam.', 'Xavfli vaziyatda telefon qanday yordam bersin? 2 ta fikr.'),
    ],
    'cybersecurity': [
        ('Parol qoidalari', 'Ma\'lumotlarni himoya qilish.', 'Telefon uchun 3 ta xavfsizlik qoidasi o\'ylab toping.'),
        ('Shubhali xabar', 'Begona xabardan ehtiyot bo\'lish.', '"Siz yutdingiz, havolani bosing" — nima qilasiz? 3 qadam.'),
        ('Do\'st so\'ramasligi', 'Parolni hech kimga bermaslik.', 'Kim sizdan parol so\'rasa nima deysiz?'),
        ('Jamoat Wi-Fi', 'Tashqarida internet xavfsizligi.', 'Kafedagi bepul Wi-Fi da nima qilmaslik kerak? 3 ta.'),
        ('Telefon yo\'qolsa', 'Ma\'lumot himoyasi.', 'Telefon yo\'qolsa birinchi 3 ta harakatingiz qanday?'),
        ('Yangi ilova o\'rnatish', 'Ruxsat so\'rashda ehtiyot.', 'Ilova kamera ruxsati so\'rasa nima qilasiz?'),
        ('Foto joylash', 'Shaxsiy ma\'lumotni himoya.', 'Internetga qanday surat joylamaslik kerak? 2 ta misol.'),
        ('So\'m so\'rash xabari', 'Firibgarlikni tanish.', 'Notanish odam pul so\'rasa qanday tekshirasiz?'),
        ('Akkaunt tiklash', 'Bir nechta usul bo\'lishi kerak.', 'Parol unutilsa qanday tiklash xavfsiz? 2 ta usul.'),
        ('Oilaviy qoidalar', 'Uyda internet xavfsizligi.', 'Uyingizda 3 ta internet qoidasi qo\'ying.'),
    ],
}

for slug, tasks in _DIRECTION_TASKS.items():
    for title, desc, instruction in tasks:
        MINI_TASKS.append((
            slug,
            title,
            desc,
            instruction,
            {
                'type': 'life_scenario',
                'term_hint': 'Bu oddiy hayotiy vazifa — yo\'nalish sizga mos keladimi-yo\'qmi, shuni his qilish uchun.',
            },
        ))
