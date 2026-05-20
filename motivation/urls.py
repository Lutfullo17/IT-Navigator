from django.urls import path

from . import views

urlpatterns = [
    path('', views.message_list, name='motivation_list'),
    path('random/', views.random_message, name='motivation_random'),
]
