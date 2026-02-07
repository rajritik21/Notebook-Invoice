"""
Database Setup Script
This script will wait for MongoDB to be available and then seed the database.
"""
import asyncio
import time
from motor.motor_asyncio import AsyncIOMotorClient
from seed_data import seed_database
from dotenv import load_dotenv
import os

async def wait_for_mongodb(max_attempts=30, delay=2):
    """Wait for MongoDB to become available."""
    print("Waiting for MongoDB to start...")
    print("Please make sure MongoDB is running:")
    print("  - Open MongoDB Compass and connect")
    print("  - Or start MongoDB service manually")
    print()
    
    client = None
    for attempt in range(1, max_attempts + 1):
        try:
            client = AsyncIOMotorClient('mongodb://localhost:27017', serverSelectionTimeoutMS=2000)
            await client.admin.command('ping')
            print(f"[OK] MongoDB is running! (attempt {attempt})")
            return client
        except Exception as e:
            if attempt < max_attempts:
                print(f"Attempt {attempt}/{max_attempts}: MongoDB not ready yet...")
                await asyncio.sleep(delay)
            else:
                print(f"\n[ERROR] Could not connect to MongoDB after {max_attempts} attempts")
                print("\nPlease:")
                print("1. Open MongoDB Compass and connect to mongodb://localhost:27017")
                print("2. Or start MongoDB service manually")
                print("3. Then run this script again")
                return None
    
    return client

async def main():
    load_dotenv()
    
    # Wait for MongoDB
    client = await wait_for_mongodb()
    if not client:
        return
    
    try:
        # Seed the database
        print("\n" + "="*50)
        print("Seeding database...")
        print("="*50 + "\n")
        await seed_database()
        print("\n" + "="*50)
        print("[SUCCESS] Database setup complete!")
        print("="*50)
        print("\nLogin credentials:")
        print("  Email: admin@stationery.com")
        print("  Password: Admin@123")
        print("\nYour application is ready at:")
        print("  Frontend: http://localhost:3000")
        print("  Backend: http://localhost:8000")
    finally:
        if client:
            client.close()

if __name__ == "__main__":
    asyncio.run(main())

