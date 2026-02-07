import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongo():
    try:
        client = AsyncIOMotorClient('mongodb://localhost:27017', serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print('[OK] MongoDB is running and accessible!')
        client.close()
        return True
    except Exception as e:
        print(f'MongoDB connection failed: {e}')
        print('\nPlease start MongoDB:')
        print('1. Open MongoDB Compass (it may start MongoDB automatically)')
        print('2. Or start MongoDB service manually')
        print('3. Or run: mongod (if MongoDB is in your PATH)')
        return False

if __name__ == "__main__":
    asyncio.run(test_mongo())

