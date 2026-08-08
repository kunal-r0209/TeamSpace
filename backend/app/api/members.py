from datetime import datetime

from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.database.models import Member, User
from app.core.jwt_handler import verify_token


router = APIRouter(
    tags=["Members"]
)

security = HTTPBearer()


# ==========================================
# ADD MEMBER
# ==========================================

@router.post("/add-member")
def add_member(
    name: str = Form(...),
    email: EmailStr = Form(...),
    phone: str = Form(...),
    organization: str = Form(...),

    credentials: HTTPAuthorizationCredentials = Depends(security),

    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_member = Member(
        name=name,
        email=email,
        phone=phone,
        organization=organization,
        created_by=user.id,
        is_deleted=False
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return {
        "message": "Member added successfully",
        "member": {
            "id": new_member.id,
            "name": new_member.name,
            "email": new_member.email,
            "phone": new_member.phone,
            "organization": new_member.organization,
            "created_by": new_member.created_by
        }
    }


# ==========================================
# GET ACTIVE MEMBERS
# ==========================================

@router.get("/members")
def get_members(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Only active members
    members = db.query(Member).filter(
        Member.is_deleted == False
    ).order_by(
        Member.id.desc()
    ).all()

    return {
        "members": [
            {
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "phone": member.phone,
                "organization": member.organization,
                "created_by": member.created_by,

                # Only creator can edit/delete
                "can_edit": (
                    member.created_by == user.id
                ),

                "can_delete": (
                    member.created_by == user.id
                )
            }
            for member in members
        ]
    }


# ==========================================
# SOFT DELETE MEMBER
# ==========================================

@router.delete("/members/{member_id}")
def delete_member(
    member_id: int,

    credentials: HTTPAuthorizationCredentials = Depends(security),

    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find active member
    member = db.query(Member).filter(
        Member.id == member_id,
        Member.is_deleted == False
    ).first()

    if member is None:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    # Only creator can delete
    if member.created_by != user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete members you created"
        )

    # SOFT DELETE
    member.is_deleted = True
    member.deleted_at = datetime.utcnow()
    member.deleted_by = user.id

    db.commit()

    return {
        "message": "Member deleted successfully"
    }
# ==========================================
# GET DELETED MEMBERS
# ==========================================

@router.get("/deleted-members")
def get_deleted_members(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = db.query(User).filter(
        User.email == payload["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    deleted_members = db.query(Member).filter(
        Member.is_deleted == True
    ).order_by(
        Member.id.desc()
    ).all()

    return {
        "members": [
            {
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "phone": member.phone,
                "organization": member.organization,
                "created_by": member.created_by,

                "can_restore": (
                    member.created_by == user.id
                )
            }
            for member in deleted_members
        ]
    }