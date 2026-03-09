from django.contrib import admin
from .models import InterviewSession, Question, Response

# Registering models so they appear in the /admin dashboard
admin.site.register(InterviewSession)
admin.site.register(Question)
admin.site.register(Response)