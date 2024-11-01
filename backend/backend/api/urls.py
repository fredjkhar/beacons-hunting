from django.urls import path
from . import views

urlpatterns = [
    path('my-endpoint/', views.my_view),
]