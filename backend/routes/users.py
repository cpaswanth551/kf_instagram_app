from typing import List
from sqlalchemy.orm import Session


from fastapi import APIRouter, Depends

from db.database import get_db
from routes.schemas import UserBase, UserDisplay
from db import db_user


router = APIRouter(prefix="/user", tags=["user"])


@router.get("/all", response_model=List[UserDisplay])
def users(db: Session = Depends(get_db)):
    return db_user.users(db)


@router.post("/")
def create(request: UserBase, db: Session = Depends(get_db)):
    return db_user.create(request, db)
