from django.urls import path

from . import views

urlpatterns = [
    path('start/', views.start_chat, name='chat_start'),
    path('my/', views.my_chats, name='chat_my_list'),
    path('<int:session_id>/send/', views.send_message, name='chat_send'),
    path('<int:session_id>/', views.chat_detail, name='chat_detail'),
]
