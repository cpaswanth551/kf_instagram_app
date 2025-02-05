from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from db import database, models
from routes import comment, post, users
from auth import autentication

app = FastAPI()


@app.get("/")
def root():
    return {"message": "hello world"}


app.include_router(users.router)
app.include_router(post.router)
app.include_router(autentication.router)
app.include_router(comment.router)


origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(database.engine)

app.mount("/images", StaticFiles(directory="images"), name="images")
