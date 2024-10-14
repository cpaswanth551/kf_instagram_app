import random
import shutil
import string
from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from auth.oauth2 import get_current_user
from db import db_post
from db.database import get_db
from routes.schemas import PostBase, PostDisplay, UserAuth

from sqlalchemy.orm import Session

router = APIRouter(prefix="/post", tags=["post"])

image_url_type = ["absolute", "relative"]


@router.post("/")
def create(
    request: PostBase,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user),
):
    if not request.image_url_type in image_url_type:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Parameters image_url_type can only take values 'absolute' or 'relative'",
        )
    return db_post.create(db=db, request=request)


@router.get("/all", response_model=List[PostDisplay])
def posts(db: Session = Depends(get_db)):
    return db_post.get_all(db)


@router.post("/images")
def upload_image(
    image: UploadFile = File(...),
    current_user: UserAuth = Depends(get_current_user),
):
    letter = string.ascii_letters
    rand_str = "".join(random.choice(letter) for i in range(6))
    new = f"_{rand_str}."
    filename = new.join(image.filename.rsplit(".", 1))
    path = f"images/{filename}"

    with open(path, "w+b") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {"filename": path}


@router.get("/delete/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserAuth = Depends(get_current_user),
):
    return db_post.delete_post(db, id, current_user.id)
