from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime

from app.database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True)

    password = Column(String, nullable=True)

    is_verified = Column(Boolean, default=True)

    is_google_user = Column(Boolean, default=False)

    picture = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # OTP
    otp = Column(String, nullable=True)

    otp_expiry = Column(DateTime, nullable=True)
class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, nullable=False, index=True)

    phone = Column(String, nullable=False)

    organization = Column(String, nullable=False)

    # Person who created the member
    created_by = Column(Integer, nullable=False, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Soft delete fields
    is_deleted = Column(Boolean, default=False, nullable=False)

    deleted_at = Column(DateTime, nullable=True)

    deleted_by = Column(Integer, nullable=True)