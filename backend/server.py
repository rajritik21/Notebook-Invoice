from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
import uuid
from typing import List

from models import (
    Admin, AdminLogin, TokenResponse,
    Retailer, RetailerCreate, RetailerUpdate,
    Product, ProductCreate, ProductUpdate,
    Invoice, InvoiceCreate, InvoiceStatus,
    Payment, PaymentCreate,
    DashboardStats
)
from auth import (
    verify_password, get_password_hash, create_access_token, verify_token
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# =============== AUTH ROUTES ===============

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: AdminLogin):
    admin_doc = await db.admins.find_one({"email": credentials.email}, {"_id": 0})
    
    if not admin_doc or not verify_password(credentials.password, admin_doc["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": admin_doc["email"]})
    
    admin = Admin(
        email=admin_doc["email"],
        name=admin_doc["name"],
        created_at=datetime.fromisoformat(admin_doc["created_at"]) if isinstance(admin_doc["created_at"], str) else admin_doc["created_at"]
    )
    
    return TokenResponse(access_token=access_token, admin=admin)

@api_router.get("/auth/verify", response_model=Admin)
async def verify(email: str = Depends(verify_token)):
    admin_doc = await db.admins.find_one({"email": email}, {"_id": 0})
    
    if not admin_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    
    return Admin(
        email=admin_doc["email"],
        name=admin_doc["name"],
        created_at=datetime.fromisoformat(admin_doc["created_at"]) if isinstance(admin_doc["created_at"], str) else admin_doc["created_at"]
    )

# =============== RETAILER ROUTES ===============

@api_router.get("/retailers", response_model=List[Retailer])
async def get_retailers(email: str = Depends(verify_token)):
    retailers = await db.retailers.find({}, {"_id": 0}).to_list(1000)
    
    for retailer in retailers:
        if isinstance(retailer.get("created_at"), str):
            retailer["created_at"] = datetime.fromisoformat(retailer["created_at"])
    
    return retailers

@api_router.post("/retailers", response_model=Retailer)
async def create_retailer(retailer: RetailerCreate, email: str = Depends(verify_token)):
    retailer_id = str(uuid.uuid4())
    retailer_data = {
        "id": retailer_id,
        **retailer.model_dump(),
        "total_due": 0.0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.retailers.insert_one(retailer_data)
    
    return Retailer(**{
        **retailer_data,
        "created_at": datetime.fromisoformat(retailer_data["created_at"])
    })

@api_router.put("/retailers/{retailer_id}", response_model=Retailer)
async def update_retailer(
    retailer_id: str,
    retailer_update: RetailerUpdate,
    email: str = Depends(verify_token)
):
    update_data = {k: v for k, v in retailer_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.retailers.update_one(
        {"id": retailer_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Retailer not found")
    
    retailer_doc = await db.retailers.find_one({"id": retailer_id}, {"_id": 0})
    
    if isinstance(retailer_doc["created_at"], str):
        retailer_doc["created_at"] = datetime.fromisoformat(retailer_doc["created_at"])
    
    return Retailer(**retailer_doc)

@api_router.delete("/retailers/{retailer_id}")
async def delete_retailer(retailer_id: str, email: str = Depends(verify_token)):
    result = await db.retailers.delete_one({"id": retailer_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Retailer not found")
    
    return {"message": "Retailer deleted successfully"}

# =============== PRODUCT ROUTES ===============

@api_router.get("/products", response_model=List[Product])
async def get_products(email: str = Depends(verify_token)):
    products = await db.products.find({}, {"_id": 0}).to_list(1000)
    
    for product in products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    return products

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, email: str = Depends(verify_token)):
    product_id = str(uuid.uuid4())
    product_data = {
        "id": product_id,
        **product.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.products.insert_one(product_data)
    
    return Product(**{
        **product_data,
        "created_at": datetime.fromisoformat(product_data["created_at"])
    })

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    email: str = Depends(verify_token)
):
    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product_doc = await db.products.find_one({"id": product_id}, {"_id": 0})
    
    if isinstance(product_doc["created_at"], str):
        product_doc["created_at"] = datetime.fromisoformat(product_doc["created_at"])
    
    return Product(**product_doc)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, email: str = Depends(verify_token)):
    result = await db.products.delete_one({"id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

# =============== INVOICE ROUTES ===============

@api_router.get("/invoices", response_model=List[Invoice])
async def get_invoices(email: str = Depends(verify_token)):
    invoices = await db.invoices.find({}, {"_id": 0}).sort("invoice_date", -1).to_list(1000)
    
    for invoice in invoices:
        if isinstance(invoice.get("created_at"), str):
            invoice["created_at"] = datetime.fromisoformat(invoice["created_at"])
        if isinstance(invoice.get("invoice_date"), str):
            invoice["invoice_date"] = datetime.fromisoformat(invoice["invoice_date"])
    
    return invoices

@api_router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str, email: str = Depends(verify_token)):
    invoice_doc = await db.invoices.find_one({"id": invoice_id}, {"_id": 0})
    
    if not invoice_doc:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    if isinstance(invoice_doc["created_at"], str):
        invoice_doc["created_at"] = datetime.fromisoformat(invoice_doc["created_at"])
    if isinstance(invoice_doc["invoice_date"], str):
        invoice_doc["invoice_date"] = datetime.fromisoformat(invoice_doc["invoice_date"])
    
    return Invoice(**invoice_doc)

@api_router.post("/invoices", response_model=Invoice)
async def create_invoice(invoice_data: InvoiceCreate, email: str = Depends(verify_token)):
    # Get retailer
    retailer = await db.retailers.find_one({"id": invoice_data.retailer_id}, {"_id": 0})
    if not retailer:
        raise HTTPException(status_code=404, detail="Retailer not found")
    
    # Calculate total amount
    total_amount = sum(p.total for p in invoice_data.products)
    due_amount = total_amount - invoice_data.paid_amount
    
    # Determine status
    if due_amount == 0:
        status = InvoiceStatus.PAID
    elif invoice_data.paid_amount > 0:
        status = InvoiceStatus.PARTIAL
    else:
        status = InvoiceStatus.UNPAID
    
    # Generate invoice number
    last_invoice = await db.invoices.find_one({}, {"_id": 0}, sort=[("invoice_number", -1)])
    if last_invoice:
        last_number = int(last_invoice["invoice_number"].split("-")[1])
        invoice_number = f"INV-{last_number + 1}"
    else:
        invoice_number = "INV-1001"
    
    # Create invoice
    invoice_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    invoice = {
        "id": invoice_id,
        "invoice_number": invoice_number,
        "retailer_id": invoice_data.retailer_id,
        "retailer_name": retailer["shop_name"],
        "products": [p.model_dump() for p in invoice_data.products],
        "total_amount": total_amount,
        "paid_amount": invoice_data.paid_amount,
        "due_amount": due_amount,
        "status": status.value,
        "invoice_date": now.isoformat(),
        "notes": invoice_data.notes,
        "created_at": now.isoformat()
    }
    
    await db.invoices.insert_one(invoice)
    
    # Update retailer total due
    await db.retailers.update_one(
        {"id": invoice_data.retailer_id},
        {"$inc": {"total_due": due_amount}}
    )
    
    # Reduce product stock
    for product in invoice_data.products:
        await db.products.update_one(
            {"id": product.product_id},
            {"$inc": {"stock_quantity": -product.quantity}}
        )
    
    # Create payment record if paid
    if invoice_data.paid_amount > 0:
        payment = {
            "id": str(uuid.uuid4()),
            "invoice_id": invoice_id,
            "invoice_number": invoice_number,
            "retailer_name": retailer["shop_name"],
            "amount": invoice_data.paid_amount,
            "payment_date": now.isoformat(),
            "notes": "Initial payment"
        }
        await db.payments.insert_one(payment)
    
    return Invoice(**{
        **invoice,
        "created_at": now,
        "invoice_date": now
    })

# =============== PAYMENT ROUTES ===============

@api_router.get("/payments", response_model=List[Payment])
async def get_payments(email: str = Depends(verify_token)):
    payments = await db.payments.find({}, {"_id": 0}).sort("payment_date", -1).to_list(1000)
    
    for payment in payments:
        if isinstance(payment.get("payment_date"), str):
            payment["payment_date"] = datetime.fromisoformat(payment["payment_date"])
    
    return payments

@api_router.post("/payments", response_model=Payment)
async def create_payment(payment_data: PaymentCreate, email: str = Depends(verify_token)):
    # Get invoice
    invoice = await db.invoices.find_one({"id": payment_data.invoice_id}, {"_id": 0})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Check if payment exceeds due amount
    if payment_data.amount > invoice["due_amount"]:
        raise HTTPException(status_code=400, detail="Payment amount exceeds due amount")
    
    # Create payment
    payment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    payment = {
        "id": payment_id,
        "invoice_id": payment_data.invoice_id,
        "invoice_number": invoice["invoice_number"],
        "retailer_name": invoice["retailer_name"],
        "amount": payment_data.amount,
        "payment_date": now.isoformat(),
        "notes": payment_data.notes
    }
    
    await db.payments.insert_one(payment)
    
    # Update invoice
    new_paid_amount = invoice["paid_amount"] + payment_data.amount
    new_due_amount = invoice["due_amount"] - payment_data.amount
    
    if new_due_amount == 0:
        new_status = InvoiceStatus.PAID.value
    elif new_paid_amount > 0:
        new_status = InvoiceStatus.PARTIAL.value
    else:
        new_status = InvoiceStatus.UNPAID.value
    
    await db.invoices.update_one(
        {"id": payment_data.invoice_id},
        {
            "$set": {
                "paid_amount": new_paid_amount,
                "due_amount": new_due_amount,
                "status": new_status
            }
        }
    )
    
    # Update retailer total due
    await db.retailers.update_one(
        {"id": invoice["retailer_id"]},
        {"$inc": {"total_due": -payment_data.amount}}
    )
    
    return Payment(**{
        **payment,
        "payment_date": now
    })

# =============== DASHBOARD ROUTES ===============

@api_router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(email: str = Depends(verify_token)):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Total sales today
    today_invoices = await db.invoices.find({
        "invoice_date": {"$gte": today_start.isoformat()}
    }, {"_id": 0}).to_list(1000)
    total_sales_today = sum(inv["total_amount"] for inv in today_invoices)
    
    # Total sales this month
    month_invoices = await db.invoices.find({
        "invoice_date": {"$gte": month_start.isoformat()}
    }, {"_id": 0}).to_list(1000)
    total_sales_month = sum(inv["total_amount"] for inv in month_invoices)
    
    # Total outstanding dues
    retailers = await db.retailers.find({}, {"_id": 0}).to_list(1000)
    total_outstanding_dues = sum(r["total_due"] for r in retailers)
    
    # Total retailers count
    total_retailers = len(retailers)
    
    # Low stock products (less than 10)
    low_stock_products = await db.products.find(
        {"stock_quantity": {"$lt": 10}},
        {"_id": 0}
    ).to_list(100)
    
    for product in low_stock_products:
        if isinstance(product.get("created_at"), str):
            product["created_at"] = datetime.fromisoformat(product["created_at"])
    
    # Recent invoices (last 5)
    recent_invoices = await db.invoices.find(
        {},
        {"_id": 0}
    ).sort("invoice_date", -1).limit(5).to_list(5)
    
    for invoice in recent_invoices:
        if isinstance(invoice.get("created_at"), str):
            invoice["created_at"] = datetime.fromisoformat(invoice["created_at"])
        if isinstance(invoice.get("invoice_date"), str):
            invoice["invoice_date"] = datetime.fromisoformat(invoice["invoice_date"])
    
    return DashboardStats(
        total_sales_today=total_sales_today,
        total_sales_month=total_sales_month,
        total_outstanding_dues=total_outstanding_dues,
        total_retailers=total_retailers,
        low_stock_products=[Product(**p) for p in low_stock_products],
        recent_invoices=[Invoice(**i) for i in recent_invoices]
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
