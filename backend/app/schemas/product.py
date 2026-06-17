from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, condecimal, conint


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    sku: str = Field(min_length=1, max_length=100)
    price: condecimal(max_digits=10, decimal_places=2, ge=0)
    quantity: conint(ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=200)
    sku: Optional[str] = Field(default=None, min_length=1, max_length=100)
    price: Optional[condecimal(max_digits=10, decimal_places=2, ge=0)] = None
    quantity: Optional[conint(ge=0)] = None


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
