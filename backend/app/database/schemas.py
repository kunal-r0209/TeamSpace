from typing import Optional
from pydantic import BaseModel, EmailStr


# ==========================
# Authentication
# ==========================

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Profile
# ==========================

class UpdateProfile(BaseModel):
    name: str


# ==========================
# Forgot Password
# ==========================

class ForgotPassword(BaseModel):
    email: EmailStr


class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    new_password: str