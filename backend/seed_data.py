from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta, timezone
import os
import uuid
import asyncio
from auth import get_password_hash

async def seed_database():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Clear existing data
    await db.admins.delete_many({})
    await db.retailers.delete_many({})
    await db.products.delete_many({})
    await db.invoices.delete_many({})
    await db.payments.delete_many({})
    
    print("Cleared existing data")
    
    # Create admin
    admin_data = {
        "email": "admin@stationery.com",
        "password_hash": get_password_hash("Admin@123"),
        "name": "Admin User",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.admins.insert_one(admin_data)
    print("Created admin: admin@stationery.com / Admin@123")
    
    # Create retailers
    retailers = [
        {"id": str(uuid.uuid4()), "shop_name": "City Books & Stationery", "owner_name": "Rajesh Kumar", "phone_number": "9876543210", "address": "MG Road, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Students Corner", "owner_name": "Priya Sharma", "phone_number": "9876543211", "address": "Jayanagar, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Office Supplies Hub", "owner_name": "Amit Patel", "phone_number": "9876543212", "address": "Koramangala, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Smart Stationery", "owner_name": "Sneha Reddy", "phone_number": "9876543213", "address": "Whitefield, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Book World", "owner_name": "Vikram Singh", "phone_number": "9876543214", "address": "Indiranagar, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Paper Plus", "owner_name": "Meera Joshi", "phone_number": "9876543215", "address": "HSR Layout, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Write Right Stationery", "owner_name": "Arjun Nair", "phone_number": "9876543216", "address": "Marathahalli, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "shop_name": "Campus Supplies", "owner_name": "Kavita Desai", "phone_number": "9876543217", "address": "BTM Layout, Bangalore", "total_due": 0.0, "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.retailers.insert_many(retailers)
    print(f"Created {len(retailers)} retailers")
    
    # Create products
    products = [
        {"id": str(uuid.uuid4()), "product_name": "A4 Notebook (200 pages)", "category": "Notebooks", "price": 120.0, "stock_quantity": 500, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Single Line Notebook", "category": "Notebooks", "price": 40.0, "stock_quantity": 800, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Double Line Notebook", "category": "Notebooks", "price": 45.0, "stock_quantity": 750, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Graph Notebook", "category": "Notebooks", "price": 50.0, "stock_quantity": 300, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Spiral Notebook A5", "category": "Notebooks", "price": 80.0, "stock_quantity": 400, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Blue Ballpoint Pen", "category": "Pens", "price": 5.0, "stock_quantity": 2000, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Black Ballpoint Pen", "category": "Pens", "price": 5.0, "stock_quantity": 1800, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Gel Pen Set (5 colors)", "category": "Pens", "price": 50.0, "stock_quantity": 300, "unit": "sets", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Pencil (HB)", "category": "Pencils", "price": 3.0, "stock_quantity": 3000, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Pencil Box", "category": "Accessories", "price": 60.0, "stock_quantity": 200, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Eraser", "category": "Accessories", "price": 5.0, "stock_quantity": 1500, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Sharpener", "category": "Accessories", "price": 5.0, "stock_quantity": 1200, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Ruler (30cm)", "category": "Accessories", "price": 15.0, "stock_quantity": 600, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Geometry Box", "category": "Accessories", "price": 100.0, "stock_quantity": 150, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "A4 Paper Ream (500 sheets)", "category": "Paper", "price": 250.0, "stock_quantity": 400, "unit": "reams", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Color Paper Pack (50 sheets)", "category": "Paper", "price": 120.0, "stock_quantity": 250, "unit": "packs", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Chart Paper (10 sheets)", "category": "Paper", "price": 80.0, "stock_quantity": 180, "unit": "packs", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Glue Stick", "category": "Adhesives", "price": 25.0, "stock_quantity": 500, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Fevicol (100ml)", "category": "Adhesives", "price": 40.0, "stock_quantity": 300, "unit": "bottles", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Stapler", "category": "Office Supplies", "price": 120.0, "stock_quantity": 8, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Stapler Pins (1000 pins)", "category": "Office Supplies", "price": 20.0, "stock_quantity": 400, "unit": "boxes", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Paper Clips (100 pcs)", "category": "Office Supplies", "price": 30.0, "stock_quantity": 6, "unit": "boxes", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "File Folder", "category": "Office Supplies", "price": 35.0, "stock_quantity": 3, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Highlighter (Set of 4)", "category": "Markers", "price": 80.0, "stock_quantity": 200, "unit": "sets", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "product_name": "Permanent Marker", "category": "Markers", "price": 25.0, "stock_quantity": 350, "unit": "pieces", "created_at": datetime.now(timezone.utc).isoformat()},
    ]
    await db.products.insert_many(products)
    print(f"Created {len(products)} products")
    
    # Create invoices
    invoice_counter = 1001
    for i in range(15):
        retailer = retailers[i % len(retailers)]
        days_ago = 30 - (i * 2)
        invoice_date = datetime.now(timezone.utc) - timedelta(days=days_ago)
        
        # Select random products
        selected_products = products[i % 20:(i % 20) + 3]
        invoice_products = []
        total_amount = 0.0
        
        for product in selected_products:
            quantity = (i % 10) + 5
            price = product["price"]
            product_total = quantity * price
            total_amount += product_total
            
            invoice_products.append({
                "product_id": product["id"],
                "product_name": product["product_name"],
                "quantity": quantity,
                "price": price,
                "total": product_total
            })
        
        # Determine payment status
        if i % 3 == 0:
            paid_amount = total_amount
            status = "paid"
        elif i % 3 == 1:
            paid_amount = total_amount * 0.5
            status = "partial"
        else:
            paid_amount = 0.0
            status = "unpaid"
        
        due_amount = total_amount - paid_amount
        
        invoice = {
            "id": str(uuid.uuid4()),
            "invoice_number": f"INV-{invoice_counter}",
            "retailer_id": retailer["id"],
            "retailer_name": retailer["shop_name"],
            "products": invoice_products,
            "total_amount": total_amount,
            "paid_amount": paid_amount,
            "due_amount": due_amount,
            "status": status,
            "invoice_date": invoice_date.isoformat(),
            "created_at": invoice_date.isoformat()
        }
        
        await db.invoices.insert_one(invoice)
        invoice_counter += 1
        
        # Update retailer total due
        await db.retailers.update_one(
            {"id": retailer["id"]},
            {"$inc": {"total_due": due_amount}}
        )
        
        # Create payment record if paid
        if paid_amount > 0:
            payment = {
                "id": str(uuid.uuid4()),
                "invoice_id": invoice["id"],
                "invoice_number": invoice["invoice_number"],
                "retailer_name": retailer["shop_name"],
                "amount": paid_amount,
                "payment_date": invoice_date.isoformat(),
                "notes": "Initial payment"
            }
            await db.payments.insert_one(payment)
    
    print(f"Created 15 invoices with payments")
    
    client.close()
    print("\n=== Seed Data Complete ===")
    print("Admin Login: admin@stationery.com / Admin@123")

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    asyncio.run(seed_database())