from rest_framework import serializers
from django.contrib.auth.models import User
from .models import InterviewSession, Question, Response

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        return user

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    response = ResponseSerializer(read_only=True)
    class Meta:
        model = Question
        fields = ['id', 'session', 'question_text', 'created_at', 'category', 'response']

class InterviewSessionSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = InterviewSession
        fields = ['id', 'user', 'target_role', 'difficulty', 'created_at', 'is_completed', 'questions']
        read_only_fields = ['user']