from pydantic import BaseModel, Field, ConfigDict, validator
from typing import List, Optional
from datetime import datetime, timezone
from enum import Enum

class InvoiceStatus(str, Enum):
    PAID = "paid"
    PARTIAL = "partial"
    UNPAID = "unpaid"

# Admin Models
class AdminCreate(BaseModel):
    email: str
    password: str
    name: str

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    email: str
    password: str

# Retailer Models
class RetailerCreate(BaseModel):
    shop_name: str
    owner_name: str
    phone_number: str
    address: str

class RetailerUpdate(BaseModel):
    shop_name: Optional[str] = None
    owner_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class Retailer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    shop_name: str
    owner_name: str
    phone_number: str
    address: str
    total_due: float = 0.0
    created_at: datetime

# Product Models
class ProductCreate(BaseModel):
    product_name: str
    category: str
    price: float
    stock_quantity: int
    unit: str

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    unit: Optional[str] = None

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    product_name: str
    category: str
    price: float
    stock_quantity: int
    unit: str
    created_at: datetime

# Invoice Models
class InvoiceProduct(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    price: float
    total: float

class InvoiceCreate(BaseModel):
    retailer_id: str
    products: List[InvoiceProduct]
    paid_amount: float = 0.0
    notes: Optional[str] = None

class Invoice(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    invoice_number: str
    retailer_id: str
    retailer_name: str
    products: List[InvoiceProduct]
    total_amount: float
    paid_amount: float
    due_amount: float
    status: InvoiceStatus
    invoice_date: datetime
    notes: Optional[str] = None
    created_at: datetime

# Payment Models
class PaymentCreate(BaseModel):
    invoice_id: str
    amount: float
    notes: Optional[str] = None

class Payment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    invoice_id: str
    invoice_number: str
    retailer_name: str
    amount: float
    payment_date: datetime
    notes: Optional[str] = None

# Dashboard Models
class DashboardStats(BaseModel):
    total_sales_today: float
    total_sales_month: float
    total_outstanding_dues: float
    total_retailers: int
    low_stock_products: List[Product]
    recent_invoices: List[Invoice]

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: Admin