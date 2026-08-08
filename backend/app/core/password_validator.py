import re
from fastapi import HTTPException


def validate_password(password: str):
    """
    Password Rules:
    - Minimum 8 characters
    - First character must be uppercase
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    - No spaces
    """

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long."
        )

    if password[0].islower():
        raise HTTPException(
            status_code=400,
            detail="Password must start with a capital letter."
        )

    if " " in password:
        raise HTTPException(
            status_code=400,
            detail="Password cannot contain spaces."
        )

    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase letter."
        )

    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain  lowercase letter."
        )

    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain number."
        )

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain special character."
        )

    return True