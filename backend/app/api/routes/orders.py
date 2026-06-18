from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app import crud, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=schemas.OrderRead, status_code=201)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, payload)


@router.get("", response_model=list[schemas.OrderRead])
def list_orders(db: Session = Depends(get_db)):
    return crud.list_orders(db)


@router.get("/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order_or_404(db, order_id)

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.full_name,
        "total_amount": order.total_amount,
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name,
                "sku": item.product.sku,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "line_total": item.line_total,
            }
            for item in order.items
        ],
    }


@router.delete("/{order_id}", status_code=204)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    crud.cancel_order(db, order_id)
    return None
