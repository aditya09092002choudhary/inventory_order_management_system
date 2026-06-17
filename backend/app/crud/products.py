from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models, schemas


def get_product_or_404(db: Session, product_id: int):
    product = db.get(models.Product, product_id)
    if not product:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def list_products(db: Session):
    return db.execute(select(models.Product).order_by(models.Product.id.desc())).scalars().all()


def create_product(db: Session, payload: schemas.ProductCreate):
    existing = db.execute(
        select(models.Product).where(models.Product.sku == payload.sku)
    ).scalar_one_or_none()
    if existing:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, payload: schemas.ProductUpdate):
    product = get_product_or_404(db, product_id)
    data = payload.model_dump(exclude_unset=True)
    if "sku" in data:
        existing = db.execute(
            select(models.Product).where(
                models.Product.sku == data["sku"],
                models.Product.id != product_id,
            )
        ).scalar_one_or_none()
        if existing:
            from fastapi import HTTPException, status
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")
    for key, value in data.items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int):
    product = get_product_or_404(db, product_id)
    in_orders = db.execute(
        select(models.OrderItem.id).where(models.OrderItem.product_id == product_id).limit(1)
    ).first()
    if in_orders:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete product referenced by existing orders",
        )
    db.delete(product)
    db.commit()
