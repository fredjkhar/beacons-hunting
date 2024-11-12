from django.urls import path
from .views import views

urlpatterns = [
    path('get/', views.my_view),
]