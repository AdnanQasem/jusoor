# AmDist Backend - Django REST API

Backend API for the AmDist scholarship platform built with Django REST Framework.

## Features

- ✅ User Authentication (JWT)
- ✅ Scholarships Management
- ✅ Services & Orders
- ✅ Application Tracking
- ✅ Contact & Support
- ✅ Admin Dashboard
- ✅ PostgreSQL Database
- ✅ CORS Support for React Frontend

## Setup Instructions

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Virtual environment

### 2. Install Dependencies

```bash
cd backend
..\venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE amdist_db;
\q
```

### 4. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and other settings.

### 5. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser

```bash
python manage.py createsuperuser
```

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login (get JWT tokens)
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update profile

### Scholarships
- `GET /api/scholarships/` - List all scholarships
- `GET /api/scholarships/{id}/` - Get scholarship details
- `GET /api/scholarships/?type=master&country=DE` - Filter scholarships

### Services
- `GET /api/services/` - List all services
- `GET /api/services/{id}/` - Get service details
- `POST /api/service-orders/` - Create service order
- `GET /api/service-orders/` - List user orders

### Applications
- `GET /api/applications/` - List user applications
- `POST /api/applications/` - Create application
- `POST /api/applications/{id}/submit/` - Submit application
- `POST /api/applications/{id}/upload_document/` - Upload document

### Contact
- `POST /api/contact/` - Send contact message
- `GET /api/faq/` - List FAQs

## API Documentation

Swagger UI: `http://localhost:8000/api/docs/`
Schema: `http://localhost:8000/api/schema/`

## Admin Panel

Access the admin panel at: `http://localhost:8000/admin/`

## Frontend Integration

Update your React frontend `.env` or API configuration:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Example API Call

```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const data = await response.json();

// Use token for authenticated requests
const scholarships = await fetch('http://localhost:8000/api/scholarships/', {
  headers: { 'Authorization': `Bearer ${data.access}` }
});
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL with strong credentials
4. Configure allowed hosts
5. Use gunicorn or uwsgi for WSGI server
6. Set up nginx for reverse proxy
7. Configure SSL/TLS

## Project Structure

```
backend/
├── amdist_backend/     # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── accounts/           # User authentication
├── scholarships/       # Scholarships management
├── services/          # Services & orders
├── applications/      # Application tracking
├── contact/           # Contact & FAQ
├── manage.py
├── requirements.txt
└── .env
```

## Development

Run tests:
```bash
python manage.py test
```

Create migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

## License

Private - AmDist Platform
