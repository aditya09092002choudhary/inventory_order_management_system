from collections import defaultdict
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models, schemas
from app.crud.customers import get_customer_or_404


def get_order_or_404(db: Session, order_id: int):
    order = db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.items).selectinload(models.OrderItem.product),
            selectinload(models.Order.customer),
        )
        .where(models.Order.id == order_id)
    ).scalar_one_or_none()
    if not order:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def list_orders(db: Session):
    return db.execute(
        select(models.Order)
        .options(
            selectinload(models.Order.items).selectinload(models.OrderItem.product),
            selectinload(models.Order.customer),
        )
        .order_by(models.Order.id.desc())
    ).scalars().all()


def create_order(db: Session, payload: schemas.OrderCreate):
    customer = get_customer_or_404(db, payload.customer_id)

    aggregated = defaultdict(int)
    for item in payload.items:
        aggregated[item.product_id] += item.quantity

    product_ids = list(aggregated.keys())
    products = db.execute(
        select(models.Product).where(models.Product.id.in_(product_ids)).with_for_update()
    ).scalars().all()

    if len(products) != len(product_ids):
        existing_ids = {product.id for product in products}
        missing = [pid for pid in product_ids if pid not in existing_ids]
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Products not found: {missing}")

    product_map = {product.id: product for product in products}

    for product_id, qty in aggregated.items():
        if product_map[product_id].quantity < qty:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product_map[product_id].name}",
            )

    order = models.Order(customer_id=customer.id, total_amount=Decimal("0.00"))
    db.add(order)
    db.flush()

    total = Decimal("0.00")
    for item in payload.items:
        product = product_map[item.product_id]
        unit_price = Decimal(str(product.price))
        line_total = unit_price * Decimal(item.quantity)
        total += line_total
        product.quantity -= item.quantity
        db.add(
            models.OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=unit_price,
                line_total=line_total,
            )
        )

    order.total_amount = total
    db.commit()
    db.refresh(order)
    return get_order_or_404(db, order.id)


def cancel_order(db: Session, order_id: int):
    order = get_order_or_404(db, order_id)

    products = db.execute(
        select(models.Product).where(
            models.Product.id.in_([item.product_id for item in order.items])
        ).with_for_update()
    ).scalars().all()

    product_map = {product.id: product for product in products}
    for item in order.items:
        if item.product_id in product_map:
            product_map[item.product_id].quantity += item.quantity

    db.delete(order)
    db.commit()
