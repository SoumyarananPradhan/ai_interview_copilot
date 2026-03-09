from django.db import models
from django.contrib.auth.models import User

class InterviewSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    target_role = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50, default="Intermediate")
    created_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.target_role} ({self.created_at.strftime('%Y-%m-%d %H:%M:%S')})"

class Question(models.Model):
    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    category = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question_text[:50]

class Response(models.Model):
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name="response")
    user_answer = models.TextField()
    ai_feedback = models.TextField(blank=True, null=True)
    technical_score = models.IntegerField(blank=True, null=True)
    communication_score = models.IntegerField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to: {self.question.question_text[:30]}"


