from django.urls import path

from .views import contact_feedback

urlpatterns = [
    path('contact/', contact_feedback, name='contact-feedback'),
]
