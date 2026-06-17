from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas


def get_customer_or_404(db: Session, customer_id: int):
    customer = db.get(models.Customer, customer_id)
    if not customer:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


def list_customers(db: Session):
    return db.execute(select(models.Customer).order_by(models.Customer.id.desc())).scalars().all()


def create_customer(db: Session, payload: schemas.CustomerCreate):
    existing = db.execute(
        select(models.Customer).where(models.Customer.email == payload.email)
    ).scalar_one_or_none()
    if existing:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    customer = models.Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int):
    customer = get_customer_or_404(db, customer_id)
    db.delete(customer)
    db.commit()
