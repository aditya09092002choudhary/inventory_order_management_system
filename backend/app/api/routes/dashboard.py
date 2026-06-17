from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud, schemas

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard", response_model=schemas.DashboardRead)
def read_dashboard(db: Session = Depends(get_db)):
    return crud.get_dashboard(db)
