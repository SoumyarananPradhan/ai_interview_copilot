from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InterviewSessionViewSet, QuestionViewSet, ResponseViewSet

router = DefaultRouter()
router.register(r'sessions', InterviewSessionViewSet, basename='interview-session')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'responses', ResponseViewSet, basename='response')

urlpatterns = [
    path('', include(router.urls)),
]