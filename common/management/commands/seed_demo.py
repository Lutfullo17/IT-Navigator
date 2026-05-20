from django.core.management.base import BaseCommand

from directions.models import Direction
from tasks.models import MiniTask
from tasks.content import MINI_TASKS
from motivation.models import MotivationalMessage


DIRECTIONS = [
    {
        'slug': 'frontend',
        'name': 'Sayt ko\'rinishi',
        'short_description': 'Sayt va ilovalarning chiroyli, tushunarli qismini yaratish — ranglar, tugmalar, sahifalar.',
        'who_is_it_for': 'Dizayn yoqadiganlar, chiroyli narsa yaratishni xohlaydiganlar.',
        'difficulty': 'O\'rta',
        'math_needed': 'Kuchli matematika shart emas.',
        'what_you_learn': 'Sayt yasash, ranglar, foydalanuvchi ko\'rishi',
        'job_market': 'Ha, talab yuqori.',
        'real_life_example': 'Payme ilovasidagi tugmalar va ranglar — shu yo\'nalish mutaxassisi ishlaydi.',
    },
    {
        'slug': 'backend',
        'name': 'Ichki tizim',
        'short_description': 'Sayt va ilovaning "ko\'rinmaydigan" qismi — ma\'lumot saqlash, hisob-kitob, tizim ishlashi.',
        'who_is_it_for': 'Mantiq yoqadiganlar, muammo yechishni xohlaydiganlar.',
        'difficulty': 'O\'rta',
        'math_needed': 'Kuchli matematika shart emas.',
        'what_you_learn': 'Dasturlash, ma\'lumotlarni saqlash, tizim mantiq',
        'job_market': 'Ha, talab juda yuqori.',
        'real_life_example': 'Payme da pul o\'tkazish — ichki tizim mutaxassisi buni boshqaradi.',
    },
    {
        'slug': 'data-analyst',
        'name': 'Ma\'lumotlar tahlili',
        'short_description': 'Raqamlar va jadvallardan foydali xulosa chiqarish — qaysi mahsulot ko\'p sotiladi, qayerda kamchilik bor.',
        'who_is_it_for': 'Raqamlar bilan ishlash yoqadiganlar, hisob-kitob qobiliyati yaxshi bo\'lganlar.',
        'difficulty': 'O\'rta',
        'math_needed': 'Asosiy matematika yetarli.',
        'what_you_learn': 'Jadvallar, diagrammalar, tahlil',
        'job_market': 'Ha, talab o\'sib bormoqda.',
        'real_life_example': 'Bank qaysi xizmat ko\'p ishlatilishini shu mutaxassis aniqlaydi.',
    },
    {
        'slug': 'ui-ux',
        'name': 'Qulay dizayn',
        'short_description': 'Ilova va saytlarni odamlar uchun oson va yoqimli qilish — qaysi tugma qayerda bo\'lishi kerak.',
        'who_is_it_for': 'Boshqa odamlar o\'rniga o\'ylash yoqadiganlar, qulaylik muhim deb biladiganlar.',
        'difficulty': 'Oson-O\'rta',
        'math_needed': 'Matematika deyarli kerak emas.',
        'what_you_learn': 'Dizayn chizish, foydalanuvchi ehtiyoji',
        'job_market': 'Ha, har bir kompaniyaga kerak.',
        'real_life_example': 'Telegram nima uchun qulay — shu yo\'nalish mutaxassisi shuni o\'ylaydi.',
    },
    {
        'slug': 'mobile',
        'name': 'Mobil ilovalar',
        'short_description': 'Telefon uchun ilovalar yaratish — Android va iPhone.',
        'who_is_it_for': 'Telefon ilovalari qiziqtiradiganlar, amaliy natija ko\'rmoqchi bo\'lganlar.',
        'difficulty': 'O\'rta',
        'math_needed': 'Kuchli matematika shart emas.',
        'what_you_learn': 'Mobil ilova yasash, telefon dizayni',
        'job_market': 'Ha, mobil ilovalar talab qilinadi.',
        'real_life_example': 'Uzum, Payme, Telegram — mobil ilova mutaxassislari yaratadi.',
    },
    {
        'slug': 'cybersecurity',
        'name': 'Kiber xavfsizlik',
        'short_description': 'Kompyuter va telefonlarni xakerlar va firibgarlardan himoya qilish.',
        'who_is_it_for': 'Xavfsizlik qiziqtiradiganlar, ehtiyotkor va diqqatli odamlar.',
        'difficulty': 'Qiyin',
        'math_needed': 'Asosiy matematika yetarli, mantiq muhimroq.',
        'what_you_learn': 'Himoya qilish, xavfni topish, qoidalar',
        'job_market': 'Ha, mutaxassislar kam.',
        'real_life_example': 'Bank mablag\'lari xavfsiz saqlanishi — kiber xavfsizlik mutaxassisi nazorat qiladi.',
    },
]

MOTIVATION_MESSAGES = [
    ('general', 'IT\'da hamma tez o\'rganmaydi — bu normal.'),
    ('general', 'Hamma dastlab qiynaladi.'),
    ('beginner', 'Siz yomon emassiz, hali boshlovchisiz.'),
    ('beginner', 'Men ham qila olaman — bu his bilan boshlang.'),
    ('struggling', 'Ichki tizimni tushunish vaqt oladi — bu normal.'),
    ('struggling', 'Xato qilish — o\'rganishning bir qismi.'),
    ('after_test', 'Natija sizni cheklamaydi — faqat yo\'l ko\'rsatadi.'),
    ('after_test', 'Eng mos yo\'nalish — sizga yoqadigan yo\'nalish.'),
    ('learning', 'Har kuni oz-ozdan o\'rganing — tez shart emas.'),
    ('learning', 'Bepul resurslar ko\'p — pul sarflash shart emas.'),
]


class Command(BaseCommand):
    help = 'Demo ma\'lumotlarni database ga qo\'shadi'

    def handle(self, *args, **options):
        self.stdout.write('Demo ma\'lumotlar qo\'shilmoqda...')

        direction_map = {}
        for data in DIRECTIONS:
            direction, created = Direction.objects.update_or_create(
                slug=data['slug'],
                defaults=data,
            )
            direction_map[data['slug']] = direction
            status = 'yaratildi' if created else 'yangilandi'
            self.stdout.write(f'  Direction: {direction.name} — {status}')

        self._seed_tasks(direction_map)
        self._seed_motivation()

        self.stdout.write(self.style.SUCCESS('Demo ma\'lumotlar tayyor!'))

    def _seed_tasks(self, direction_map):
        MiniTask.objects.all().update(is_active=False)

        direction_orders = {}
        for slug, title, desc, instruction, task_data in MINI_TASKS:
            direction = direction_map[slug]
            direction_orders[slug] = direction_orders.get(slug, 0) + 1

            MiniTask.objects.update_or_create(
                direction=direction,
                title=title,
                defaults={
                    'description': desc,
                    'instruction': instruction,
                    'task_data': task_data,
                    'order': direction_orders[slug],
                    'is_active': True,
                },
            )

        self.stdout.write(f'  MiniTask: {len(MINI_TASKS)} ta')

    def _seed_motivation(self):
        for i, (category, text) in enumerate(MOTIVATION_MESSAGES, 1):
            MotivationalMessage.objects.update_or_create(
                text=text,
                defaults={'category': category, 'order': i, 'is_active': True},
            )

        self.stdout.write(f'  MotivationalMessage: {len(MOTIVATION_MESSAGES)} ta')
