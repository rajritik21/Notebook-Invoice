# How to Start the Project

## Quick Links
- [Running on Local Network](./NETWORK_SETUP.md) - Access from other devices on same network

## Prerequisites
- MongoDB must be running (check with MongoDB Compass or service)
- Python 3.x installed
- Node.js and Yarn installed

## Step 1: Start MongoDB
Make sure MongoDB is running:
- Open MongoDB Compass and connect to `mongodb://localhost:27017`
- Or start MongoDB service: `net start MongoDB`

## Step 2: Start Backend Server

Open a terminal and run:

```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Or using uvicorn directly:**
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

The backend will start at: **http://localhost:8000**
- API Documentation: http://localhost:8000/docs

## Step 3: Start Frontend Server

Open a **NEW terminal** (keep backend running) and run:

```bash
cd frontend
npm start
```

**Or using yarn:**
```bash
cd frontend
yarn start
```

### If you get dependency errors:

If you encounter `ajv` or other dependency errors, reinstall dependencies:

```bash
cd frontend
rm -rf node_modules package-lock.json  # On Windows: rmdir /s node_modules
npm install --legacy-peer-deps
npm start
```

The frontend will start at: **http://localhost:3000**

---

## Quick Start (Both Servers)

### Windows PowerShell (2 separate terminals):

**Terminal 1 - Backend:**
```powershell
cd F:\Notebook\backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd F:\Notebook\frontend
yarn start
```

### Windows CMD (2 separate terminals):

**Terminal 1 - Backend:**
```cmd
cd F:\Notebook\backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```cmd
cd F:\Notebook\frontend
yarn start
```

---

## First Time Setup

If you haven't seeded the database yet:

```bash
cd backend
python seed_data.py
```

This creates:
- Admin user: `admin@stationery.com` / `Admin@123`
- Sample data (retailers, products, invoices)

---

## Stop Servers

Press `Ctrl + C` in each terminal to stop the servers.

---

## Troubleshooting

**Backend won't start?**
- Check if port 8000 is already in use
- Make sure MongoDB is running
- Verify Python dependencies: `pip install -r requirements.txt`

**Frontend won't start?**
- Check if port 3000 is already in use
- Install dependencies: `yarn install` or `npm install`
- Check if backend is running on port 8000

**MongoDB connection error?**
- Start MongoDB: Open MongoDB Compass and connect
- Or start service: `net start MongoDB`

