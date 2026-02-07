# Running on Local Network

This guide shows how to run the project so it's accessible from other devices on the same network.

## Step 1: Find Your Local IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x or 10.x.x.x)

**Or run:**
```bash
get_local_ip.bat
```

**Example IP:** `192.168.1.100`

## Step 2: Update Backend Configuration

Edit `backend/.env` and update CORS_ORIGINS:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=invoicehub
CORS_ORIGINS=http://localhost:3000,http://YOUR_IP:3000
SECRET_KEY=your-secret-key-change-in-production-12345678
```

Replace `YOUR_IP` with your actual IP (e.g., `192.168.1.100`)

## Step 3: Update Frontend Configuration

Edit `frontend/.env` and set the backend URL:

```env
REACT_APP_BACKEND_URL=http://YOUR_IP:8000
```

Replace `YOUR_IP` with your actual IP (e.g., `192.168.1.100`)

## Step 4: Start Backend (Network Mode)

**Option A: Use the batch file**
```bash
start_backend_network.bat
```

**Option B: Manual command**
```bash
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

The `--host 0.0.0.0` makes it accessible from other devices.

## Step 5: Start Frontend (Network Mode)

**Option A: Use the batch file**
```bash
start_frontend_network.bat
```

**Option B: Manual command**
```bash
cd frontend
set HOST=0.0.0.0
npm start
```

**Or on Windows PowerShell:**
```powershell
cd frontend
$env:HOST="0.0.0.0"
npm start
```

## Step 6: Access from Other Devices

On other devices connected to the same network:

- **Frontend:** `http://YOUR_IP:3000`
- **Backend API:** `http://YOUR_IP:8000`
- **API Docs:** `http://YOUR_IP:8000/docs`

**Example:**
- Frontend: `http://192.168.1.100:3000`
- Backend: `http://192.168.1.100:8000`

## Quick Setup Script

Create a file `setup_network.bat`:

```batch
@echo off
echo Enter your local IP address:
set /p MY_IP=

echo Updating backend .env...
cd backend
python -c "import os; content = open('.env', 'r').read(); content = content.replace('CORS_ORIGINS=http://localhost:3000', 'CORS_ORIGINS=http://localhost:3000,http://%MY_IP%:3000'); open('.env', 'w').write(content)"

echo Updating frontend .env...
cd ..\frontend
echo REACT_APP_BACKEND_URL=http://%MY_IP%:8000 > .env

echo.
echo Configuration updated!
echo Backend: http://%MY_IP%:8000
echo Frontend: http://%MY_IP%:3000
echo.
pause
```

## Troubleshooting

**Can't access from other devices?**
1. Check Windows Firewall - allow ports 3000 and 8000
2. Verify devices are on the same network
3. Check IP address is correct
4. Make sure backend is running with `--host 0.0.0.0`

**Firewall Settings:**
```bash
# Allow ports through Windows Firewall
netsh advfirewall firewall add rule name="Backend Port 8000" dir=in action=allow protocol=TCP localport=8000
netsh advfirewall firewall add rule name="Frontend Port 3000" dir=in action=allow protocol=TCP localport=3000
```

**CORS errors?**
- Make sure `CORS_ORIGINS` in backend `.env` includes your IP
- Restart backend after changing `.env`

## Security Note

⚠️ **Warning:** Running on `0.0.0.0` makes your server accessible to anyone on your local network. Only do this on trusted networks (home/office). For production, use proper security measures.

