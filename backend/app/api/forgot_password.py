from datetime import datetime, timedelta
from app.database.schemas import VerifyOTP
from app.database.schemas import ResetPassword

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import User
from app.database.schemas import ForgotPassword

from app.core.otp import generate_otp
from app.core.email import send_otp_email

from app.core.security import hash_password
from app.core.password_validator import validate_password

router = APIRouter(
    prefix="/auth",
    tags=["Forgot Password"]
)


@router.post("/forgot-password")
def forgot_password(
    data: ForgotPassword,
    db: Session = Depends(get_db)
):

    # Find user
    user = db.query(User).filter(User.email == data.email).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="Email not found"
        )

    # Generate OTP
    otp = generate_otp()

    # Save OTP
    user.otp = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)

    db.commit()

    # Send email
    send_otp_email(user.email, otp)

    return {
        "message": "OTP sent successfully"
    }

@router.post("/verify-otp")
def verify_otp(
    data: VerifyOTP,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.otp != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    if user.otp_expiry < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="OTP Expired"
        )
    

    return {
        "message": "OTP Verified Successfully"
    }
@router.post("/reset-password")
def reset_password(
    data: ResetPassword,
    db: Session = Depends(get_db)
):
    # Find user
    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Verify OTP
    if user.otp != data.otp:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    # Check OTP expiry
    if user.otp_expiry is None or user.otp_expiry < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="OTP Expired"
        )

    # Validate new password
    validate_password(data.new_password)

    # Update password
    user.password = hash_password(data.new_password)

    # Clear OTP
    user.otp = None
    user.otp_expiry = None

    db.commit()

    return {
        "message": "Password reset successful"
    }