from django.urls import path

from . import views
app_name='main'
urlpatterns = [
    path("home/<slug:q_slug>/", views.home, name="home"),
    path("about", views.about, name="about"),
    path("", views.index, name="index"),
    path("develop", views.develop, name="develop"),
    path("APIGET", views.APIGET, name="APIGET"),
]