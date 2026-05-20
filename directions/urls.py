from django.urls import path
from . import views

urlpatterns = [
    path('', views.direction_list, name='direction_list'),
    path('<slug:slug>/', views.direction_detail, name='direction_detail'),
]
