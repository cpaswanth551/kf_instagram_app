from fastapi import Depends, HTTPException, status
from db.models import DbUser
from routes.schemas import UserBase
from db.hashing import Hash
from sqlalchemy.orm.session import Session


def users(db: Session):
    users = db.query(DbUser).all()
    return users


def create(request: UserBase, db: Session):
    new_user = DbUser(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_user_by_username(db: Session, username: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username {username} not found",
        )
    return user
