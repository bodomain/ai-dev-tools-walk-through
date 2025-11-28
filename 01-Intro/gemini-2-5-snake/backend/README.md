# Django backend for scores

This folder contains a minimal Django backend for storing and listing game scores.

Quick start:

1. Create a virtualenv and install dependencies:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Apply migrations and run the server (default port 8000):
```bash
python manage.py migrate
python manage.py runserver
```

3. API endpoints:
- `GET /api/scores/` - list scores (ordered by score desc)
- `POST /api/scores/` - create a new score (json {"name": "Player", "score": 100})

Note: This is a lightweight example for local development and doesn't include production settings.
