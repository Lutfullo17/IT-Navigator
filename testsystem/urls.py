from django.urls import path

from . import views

urlpatterns = [
    path('start/', views.start_test, name='test_start'),
    path('my/', views.my_tests, name='test_my_list'),
    path('<int:session_id>/submit/', views.submit_answers, name='test_submit'),
    path('<int:session_id>/', views.test_detail, name='test_detail'),
]
