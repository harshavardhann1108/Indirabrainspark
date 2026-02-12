# How to Access Quiz on Mobile Device

## Your Network Details
- **Computer IP Address**: `10.255.73.111`
- **Frontend URL**: `http://10.255.73.111:5173`
- **Backend URL**: `http://10.255.73.111:8000`

---

## Steps to Access on Mobile

### 1. **Ensure Both Devices are on Same WiFi Network**
- Your computer and mobile must be connected to the same WiFi network
- Check your mobile WiFi settings

### 2. **Frontend is Already Running with Network Access**
The frontend server is now accessible at:
```
http://10.255.73.111:5173
```

### 3. **Backend Server Needs Restart**
The backend needs to bind to all network interfaces. Stop the current backend server (Ctrl+C in the terminal) and restart with:

```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0
```

### 4. **Update Frontend API URL (if needed)**
If the mobile can't connect to the backend, update `frontend\.env`:

```
VITE_API_URL=http://10.255.73.111:8000
```

Then restart the frontend server.

### 5. **Check Windows Firewall**
Windows Firewall might block incoming connections. You may need to:

**Option A - Allow Node.js and Python through Firewall:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" and "Python" and check both Private and Public
4. Click OK

**Option B - Create Firewall Rules (Advanced):**
```powershell
# Run PowerShell as Administrator
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "FastAPI Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

### 6. **Access on Mobile**
Open your mobile browser and go to:
```
http://10.255.73.111:5173
```

---

## Troubleshooting

### Mobile Can't Connect
1. **Ping test**: Try pinging your computer from mobile
2. **Firewall**: Temporarily disable Windows Firewall to test
3. **Network**: Ensure both devices are on same WiFi (not guest network)

### Backend Connection Fails
- Make sure backend is running with `--host 0.0.0.0`
- Check CORS settings in `backend\.env`
- Verify port 8000 is not blocked by firewall

### Frontend Loads but API Calls Fail
- Update `frontend\.env` with network IP
- Restart frontend server after changing .env
- Check browser console for CORS errors

---

## Quick Commands

**Start Frontend (with network access):**
```bash
cd frontend
npm run dev -- --host
```

**Start Backend (with network access):**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0
```

---

## Current Status
✅ Frontend: Running on network at `http://10.255.73.111:5173`
⏳ Backend: Needs restart with `--host 0.0.0.0` flag
✅ CORS: Updated to allow network IP
