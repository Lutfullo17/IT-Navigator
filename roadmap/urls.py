from django.urls import path

from . import views

urlpatterns = [
    path('', views.roadmap_list, name='roadmap_list'),
    path('my/', views.my_progress, name='roadmap_my_progress'),
    path('<int:step_id>/complete/', views.complete_step, name='roadmap_complete'),
]
