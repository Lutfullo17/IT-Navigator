from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile
from .utils import normalize_phone


from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import Profile
from .utils import normalize_phone, is_valid_uz_phone


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=20)

    def validate_full_name(self, value):
        name = value.strip()
        if len(name) < 2:
            raise serializers.ValidationError('Ism kamida 2 ta harfdan iborat bo\'lishi kerak')
        return name

    def validate_phone(self, value):
        phone = normalize_phone(value)
        if not is_valid_uz_phone(phone):
            raise serializers.ValidationError(
                'Telefon raqam noto\'g\'ri. +998 dan keyin 9 ta raqam kiriting'
            )
        if Profile.objects.filter(phone=phone).exists():
            raise serializers.ValidationError('Bu telefon allaqachon ro\'yxatdan o\'tgan')
        if User.objects.filter(username=phone).exists():
            raise serializers.ValidationError('Bu telefon allaqachon ro\'yxatdan o\'tgan')
        return phone

    @transaction.atomic
    def create(self, validated_data):
        phone = validated_data['phone']
        full_name = validated_data['full_name']

        user = User(username=phone, first_name=full_name)
        user.set_unusable_password()
        user.save()

        Profile.objects.create(
            user=user,
            phone=phone,
            full_name=full_name,
        )

        return user


class PhoneLoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)

    def validate(self, data):
        phone = normalize_phone(data['phone'])
        if not is_valid_uz_phone(phone):
            raise serializers.ValidationError({
                'phone': 'Telefon raqam noto\'g\'ri. +998 dan keyin 9 ta raqam kiriting',
            })

        try:
            profile = Profile.objects.select_related('user').get(phone=phone)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({'phone': 'Bu telefon ro\'yxatdan o\'tmagan'})

        data['user'] = profile.user
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='profile.full_name', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    preferred_language = serializers.CharField(source='profile.preferred_language', read_only=True)
    onboarding_completed = serializers.BooleanField(source='profile.onboarding_completed', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'full_name', 'phone', 'preferred_language', 'onboarding_completed',
        ]


class ProfileUpdateSerializer(serializers.Serializer):
    preferred_language = serializers.ChoiceField(choices=Profile.LANGUAGE_CHOICES, required=False)

    def update(self, instance, validated_data):
        profile, _ = Profile.objects.get_or_create(
            user=instance,
            defaults={
                'phone': instance.username,
                'full_name': (instance.first_name or '').strip(),
            },
        )

        if 'preferred_language' in validated_data:
            profile.preferred_language = validated_data['preferred_language']
            profile.save(update_fields=['preferred_language'])

        return instance
