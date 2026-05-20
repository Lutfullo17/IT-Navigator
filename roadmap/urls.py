from django.urls import path

from . import views

urlpatterns = [
    path('plan/', views.roadmap_plan, name='roadmap_plan'),
]
