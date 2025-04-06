## Uv with django
https://blog.pecar.me/uv-with-django


# TODO
  - Replace SQLite queries will be replaced with Django ORM


### Templates Migration


1. **Keep Using Jinja2 (Recommended)**
   - Configure Django to use Jinja2 template engine
   - Benefits:
     - Minimal template changes needed
     - Keep existing template syntax
     - More flexible than Django templates
   - Changes needed:
     - Update template file extensions from `.jinja` to `.jinja2` (Django convention)
     - Adapt template context processors
     - Update URL tag syntax from `{{ url_for() }}` to `{{ url() }}`


## Major Structural Changes

1. Project Layout
   ```
   rss_reader/
   ├── manage.py
   ├── rss_reader/
   │   ├── __init__.py
   │   ├── settings.py      # Django settings
   │   ├── urls.py         # URL configuration
   │   ├── asgi.py        # ASGI configuration
   │   └── wsgi.py        # WSGI configuration
   ├── apps/
   │   ├── feeds/         # RSS feed functionality
   │   │   ├── models.py
   │   │   ├── views.py
   │   │   └── urls.py
   │   └── users/         # User authentication
   │       ├── models.py
   │       ├── views.py
   │       └── urls.py
   └── templates/
       └── *.jinja2
   ```

2. Authentication System
   - Use Django's User model 
   - Implement login/logout views using Django auth views
   - Update authentication decorators from `@login_required` to Django's version
