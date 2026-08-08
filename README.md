 
# TeamSpace – Secure Team Management System

TeamSpace is a full-stack team management application built with **React, FastAPI, PostgreSQL, and JWT authentication**.

The application allows users to securely create accounts, log in, manage their profiles, add team members, and control member-editing permissions based on ownership.

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Google OAuth login
- Password visibility toggle
- Forgot password functionality
- OTP-based password reset
- Password validation
- Protected routes

### Team Management
- Add team members
- View all team members
- Edit members created by the logged-in user
- View-only access for members created by other users
- Soft delete members
- Deleted members remain stored in PostgreSQL
- Owner-based member permissions

### Dashboard
- Professional responsive dashboard
- Dark / Light theme
- User profile information
- Team member management
- Member count
- Owner-based actions
- Responsive UI

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- Axios
- React Icons
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- OAuth / Google Authentication

### Database
- PostgreSQL
- pgAdmin

## 📁 Project Structure

```text
Login-System/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── database/
│   │   ├── routers/
│   │   └── main.py
│   │
│   ├── .env
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md