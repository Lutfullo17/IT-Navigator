from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    preferred_language = serializers.ChoiceField(
        choices=Profile.LANGUAGE_CHOICES,
        default='uz',
        write_only=True,
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'preferred_language']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Parollar mos kelmadi'})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        preferred_language = validated_data.pop('preferred_language', 'uz')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )

        Profile.objects.create(
            user=user,
            preferred_language=preferred_language,
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    preferred_language = serializers.CharField(source='profile.preferred_language', read_only=True)
    onboarding_completed = serializers.BooleanField(source='profile.onboarding_completed', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'preferred_language', 'onboarding_completed']
        read_only_fields = ['id', 'username', 'email']
