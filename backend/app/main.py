from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.database.db import Base, engine
from app.database.models import User
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.google import router as google_router
from app.api.forgot_password import router as forgot_router
from app.api.members import router as members_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Authentication API",
    version="1.0.0"
)

app.add_middleware(
    SessionMiddleware,
    secret_key="my_super_secret_session_key_123"
)

FRONTEND_URL = "https://teamspace-frontend-ym02.onrender.com"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://teamspace-frontend-ym02.onrender.com",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forgot_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(google_router)
app.include_router(members_router)


@app.get("/")
def root():
    return {"message": "Authentication API Running 🚀"}