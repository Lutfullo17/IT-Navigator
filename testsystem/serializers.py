from rest_framework import serializers

from .models import TestSession, UserAnswer


class TestSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestSession
        fields = [
            'id',
            'questions',
            'results',
            'started_at',
            'completed_at',
            'is_completed',
        ]
        read_only_fields = ['id', 'questions', 'results', 'started_at', 'completed_at', 'is_completed']


class UserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnswer
        fields = ['question_index', 'selected_option']


class SubmitAnswersSerializer(serializers.Serializer):
    answers = UserAnswerSerializer(many=True)

    def validate_answers(self, value):
        if not value:
            raise serializers.ValidationError('Kamida bitta javob kerak')

        session = self.context['session']
        question_count = len(session.questions)

        for answer in value:
            index = answer['question_index']
            if index < 0 or index >= question_count:
                raise serializers.ValidationError(f'Savol {index} mavjud emas')

            question = session.questions[index]
            if answer['selected_option'] not in question['options']:
                raise serializers.ValidationError(
                    f'"{answer["selected_option"]}" varianti noto\'g\'ri'
                )

        return value
