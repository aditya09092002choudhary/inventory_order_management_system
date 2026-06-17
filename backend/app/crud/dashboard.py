from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import models
from app.core.config import LOW_STOCK_THRESHOLD


def get_dashboard(db: Session):
    total_products = db.execute(select(func.count(models.Product.id))).scalar_one()
    total_customers = db.execute(select(func.count(models.Customer.id))).scalar_one()
    total_orders = db.execute(select(func.count(models.Order.id))).scalar_one()

    low_stock_products = db.execute(
        select(models.Product)
        .where(models.Product.quantity <= LOW_STOCK_THRESHOLD)
        .order_by(models.Product.quantity.asc(), models.Product.id.desc())
    ).scalars().all()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": low_stock_products,
    }
