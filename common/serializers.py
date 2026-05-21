from rest_framework import serializers


class ContactFeedbackSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    telegram = serializers.CharField(max_length=64)
    message = serializers.CharField(max_length=2000)
