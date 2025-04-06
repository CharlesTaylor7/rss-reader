# Flask to Django Migration Plan

## Dependencies Changes

### Remove Flask Dependencies
- flask
- flask-login
- werkzeug (for password hashing)

### Add Django Dependencies
- django>=5.0.0
- django-environ>=0.11.2 (for environment management)

### Keep Existing Dependencies
- requests (for HTTP requests)
- defusedxml (still useful for secure XML parsing)

### Development Dependencies (keep as is)
- pytest
- pyright
- ruff

## Code Migration Strategy

### Code That Can Be Kept
1. Database Models Logic
   - User model needs to be adapted to Django's auth system
   - Blog and Post models can be converted to Django models with minimal changes
   - SQLite queries will be replaced with Django ORM

2. RSS Feed Processing
   - `sync.py` functionality can be mostly preserved
   - Will need to update database interactions to use Django ORM
   - XML processing logic remains the same

3. Date Handling
   - `date.py` utility functions can be kept as is
   - Test file `test_date.py` remains unchanged

### Templates Migration

Django uses its own template engine by default, but can use Jinja2. We have two options:

1. **Keep Using Jinja2 (Recommended)**
   - Install `jinja2` package
   - Configure Django to use Jinja2 template engine
   - Benefits:
     - Minimal template changes needed
     - Keep existing template syntax
     - More flexible than Django templates
   - Changes needed:
     - Update template file extensions from `.jinja` to `.jinja2` (Django convention)
     - Adapt template context processors
     - Update URL tag syntax from `{{ url_for() }}` to `{{ url() }}`

2. **Switch to Django Templates**
   - Requires more template changes
   - Changes needed:
     - Convert `{% block %}` syntax (mostly compatible)
     - Update URL tags from `{{ url_for() }}` to `{% url '' %}`
     - Update template inheritance syntax
     - Convert filters and functions

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
   - Replace Flask-Login with Django's built-in auth system
   - Use Django's User model or create a custom user model
   - Implement login/logout views using Django auth views
   - Update authentication decorators from `@login_required` to Django's version

3. URL Routing
   - Convert Flask routes to Django URL patterns
   - Move from function-based views to class-based views where appropriate
   - Implement proper URL namespacing

4. Forms
   - Create Django forms for all data input
   - Add CSRF protection (built into Django)
   - Implement form validation using Django's form system

5. Database
   - Convert SQLite direct queries to Django ORM
   - Create and apply migrations
   - Use Django's database configuration

## Next Steps

1. Set up basic Django project structure
2. Configure Django settings
3. Create Django apps for different components
4. Migrate models and database schema
5. Convert views and URLs
6. Update templates
7. Implement authentication
8. Test and debug
