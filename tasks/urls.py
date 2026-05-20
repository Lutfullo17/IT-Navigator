from django.urls import path

from . import views

urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('my/', views.my_completions, name='task_my_completions'),
    path('<int:task_id>/complete/', views.complete_task, name='task_complete'),
    path('<int:task_id>/', views.task_detail, name='task_detail'),
]
