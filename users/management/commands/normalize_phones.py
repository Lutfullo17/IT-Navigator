from django.core.management.base import BaseCommand

from users.models import Profile
from users.utils import normalize_phone


class Command(BaseCommand):
    help = 'Profile telefonlarini 998XXXXXXXXX formatiga keltiradi'

    def handle(self, *args, **options):
        updated = 0
        for profile in Profile.objects.exclude(phone__isnull=True).exclude(phone=''):
            canonical = normalize_phone(profile.phone)
            if profile.phone != canonical:
                profile.phone = canonical
                profile.save(update_fields=['phone'])
                updated += 1
                self.stdout.write(f'  {profile.user_id}: {canonical}')

        self.stdout.write(self.style.SUCCESS(f'Tayyor: {updated} ta yangilandi'))
