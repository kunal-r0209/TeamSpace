from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

from app.database.db import get_db
from app.database.models import User
from app.core.jwt_handler import create_access_token

config = Config(".env")

CLIENT_ID = config("GOOGLE_CLIENT_ID")
CLIENT_SECRET = config("GOOGLE_CLIENT_SECRET")

oauth = OAuth(config)

oauth.register(
    name="google",
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    },
)

router = APIRouter(
    prefix="/auth",
    tags=["Google Login"]
)


@router.get("/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri
    )


@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    token = await oauth.google.authorize_access_token(request)

    info = token["userinfo"]

    user = db.query(User).filter(
        User.email == info["email"]
    ).first()

    if not user:
        user = User(
            name=info["name"],
            email=info["email"],
            password=None,
            picture=info["picture"],
            is_verified=True,
            is_google_user=True
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = create_access_token(
        {"sub": user.email}
    )

    return RedirectResponse(
        url=f"http://localhost:5173/google-success?token={jwt_token}"
    )