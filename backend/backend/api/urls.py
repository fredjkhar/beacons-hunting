from django.urls import path
from .views import my_view

urlpatterns = [
    path('api/get/', my_view, name='get_data'),
]