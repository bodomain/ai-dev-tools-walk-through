# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Backend (Django) for storing scores

This project now includes a minimal Django backend in the `backend/` folder to store and retrieve game scores.

Quickly run the backend:

1. From the project root, create the venv and install the dependencies for the backend:
```bash
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

2. Apply migrations and run the server:
```bash
cd backend
./venv/bin/python manage.py migrate
./venv/bin/python manage.py runserver 127.0.0.1:8000
```

3. Update the React front-end to save and list scores:
 - The front-end already calls `http://127.0.0.1:8000/api/scores/` for reading and writing scores. When the backend is running, saving scores from the UI will persist them.

If you prefer a Dockerized or production setup, you'll need to add production-ready settings and a persistent database.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
