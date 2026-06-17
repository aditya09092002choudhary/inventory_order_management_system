from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, conint


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: conint(gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    items: List[OrderItemCreate]


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    line_total: Decimal
    product_name: Optional[str] = None
    sku: Optional[str] = None


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    customer_id: int
    customer_name: Optional[str] = None
    total_amount: Decimal
    items: List[OrderItemRead]


class OrderSummaryRead(BaseModel):
    id: int
    customer_id: int
    customer_name: Optional[str] = None
    total_amount: Decimal
    item_count: int
    created_at: Optional[str] = None
