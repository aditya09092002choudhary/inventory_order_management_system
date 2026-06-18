import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.router import api_router
from app.core.config import CORS_ORIGINS
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401


app = FastAPI(title="Inventory & Order Management API", version="1.0.0")

allow_origins = ["*"] if "*" in CORS_ORIGINS else CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    deadline = time.time() + 30
    last_error = None
    while time.time() < deadline:
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            Base.metadata.create_all(bind=engine)
            return
        except Exception as exc:
            last_error = exc
            time.sleep(2)
    raise last_error
