import random
from app.database.schemas import ForgotPassword, VerifyOTP, ResetPassword
from app.core.email import send_email
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.password_validator import validate_password
from app.database.db import get_db
from app.database.models import User
from app.database.schemas import UserSignup, UserLogin
from app.core.security import hash_password, verify_password
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "mysecretkey123"
ALGORITHM = "HS256"

router = APIRouter(
    
    prefix="/auth",
    tags=["Authentication"]
)
otp_storage = {}

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):

    validate_password(user.password)

    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)


    token = jwt.encode(
        {
            "sub": new_user.email,
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Signup successful",
        "token": token
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()

    if existing is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, existing.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = jwt.encode(
        {
            "sub": existing.email,
            "exp": datetime.utcnow() + timedelta(days=1)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": f"Welcome {existing.name}",
        "token": token
    }

@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    otp = str(random.randint(100000, 999999))

    otp_storage[data.email] = otp

    send_email(
        data.email,
        "Password Reset OTP",
        f"Your OTP is: {otp}"
    )

    return {
        "message": "OTP sent to email"
    }

@router.post("/verify-otp")
def verify_otp(data: VerifyOTP):

    stored_otp = otp_storage.get(data.email)

    if stored_otp is None:
        raise HTTPException(
            status_code=404,
            detail="OTP not found"
        )

    if stored_otp != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    return {
        "message": "OTP verified successfully"
    }