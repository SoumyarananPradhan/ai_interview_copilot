from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import InterviewSession, Question, Response
from .serializers import InterviewSessionSerializer, QuestionSerializer, RegisterSerializer, ResponseSerializer
from .ai_utils import generate_interview_question, evaluate_interview_answer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class InterviewSessionViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InterviewSession.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        session = serializer.save(user=self.request.user)
        ai_question_data = generate_interview_question(
            target_role=session.target_role, 
            difficulty=session.difficulty
        )
        Question.objects.create(
            session=session,
            question_text=ai_question_data.get('question_text'),
            category=ai_question_data.get('category', 'Technical')
        )

    @action(detail=True, methods=['post'])
    def next_question(self, request, pk=None):
        session = self.get_object()
        previous_questions = list(session.questions.values_list('question_text', flat=True))
        ai_question_data = generate_interview_question(
            target_role=session.target_role,
            difficulty=session.difficulty,
            previous_questions=previous_questions
        )
        new_question = Question.objects.create(
            session=session,
            question_text=ai_question_data.get('question_text'),
            category=ai_question_data.get('category', 'Technical')
        )
        return DRFResponse(QuestionSerializer(new_question).data)

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def submit_and_evaluate(self, request):
        question_id = request.data.get('question_id')
        user_answer = request.data.get('user_answer')
        try:
            question = Question.objects.get(id=question_id, session__user=request.user)
        except Question.DoesNotExist:
            return DRFResponse({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

        target_role = question.session.target_role
        evaluation = evaluate_interview_answer(question.question_text, user_answer, target_role)

        response_obj, created = Response.objects.update_or_create(
            question=question,
            defaults={
                'user_answer': user_answer,
                'ai_feedback': evaluation.get('feedback', ''),
                'technical_score': evaluation.get('technical_score', 0),
                'communication_score': evaluation.get('communication_score', 0)
            }
        )
        return DRFResponse(ResponseSerializer(response_obj).data)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    # Ensure only logged-in users can access this
    permission_classes = [IsAuthenticated]