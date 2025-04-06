from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy
from django.views.generic.edit import CreateView
from django.contrib.auth.forms import UserCreationForm


class LoginView(auth_views.LoginView):
    template_name = "login.jinja"
    next_page = reverse_lazy("home")


class RegisterView(CreateView):
    form_class = UserCreationForm
    template_name = "register.jinja"
    success_url = reverse_lazy("login")
