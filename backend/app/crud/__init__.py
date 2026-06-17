from app.crud.customers import create_customer, delete_customer, get_customer_or_404, list_customers
from app.crud.dashboard import get_dashboard
from app.crud.orders import cancel_order, create_order, get_order_or_404, list_orders
from app.crud.products import create_product, delete_product, get_product_or_404, list_products, update_product

__all__ = [
    "create_product",
    "delete_product",
    "get_product_or_404",
    "list_products",
    "update_product",
    "create_customer",
    "delete_customer",
    "get_customer_or_404",
    "list_customers",
    "create_order",
    "cancel_order",
    "get_order_or_404",
    "list_orders",
    "get_dashboard",
]
