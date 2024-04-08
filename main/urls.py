from django.urls import path

from . import views
app_name='main'
urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about, name="about"),
    path("home", views.home, name="home"),
    path("develop", views.develop, name="develop"),
    path("APIGET", views.APIGET, name="APIGET"),
]