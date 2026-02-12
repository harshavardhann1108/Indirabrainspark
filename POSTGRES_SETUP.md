# Quick Start Instructions - PostgreSQL Setup Required

## ⚠️ PostgreSQL Not Detected

The backend requires PostgreSQL to be running. You have two options:

---

## Option 1: Use Cloud PostgreSQL (EASIEST - 5 minutes)

### Using Supabase (Free):

1. **Sign up**: Go to https://supabase.com/
2. **Create Project**: Click "New Project"
   - Choose a name (e.g., "indira-brainstorm")
   - Set a database password (save it!)
   - Choose a region close to you
   - Wait 2-3 minutes for setup

3. **Get Connection String**:
   - Go to Project Settings → Database
   - Find "Connection String" → "URI"
   - Copy the connection string (looks like: `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres`)

4. **Update Backend .env**:
   - Open `backend\.env`
   - Replace the DATABASE_URL line with your Supabase connection string
   - Example: `DATABASE_URL=postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres`

5. **Seed Database**:
   ```bash
   cd backend
   python seed_questions.py
   ```

---

## Option 2: Install PostgreSQL Locally

### Windows Installation:

1. **Download**: https://www.postgresql.org/download/windows/
2. **Install**: Run installer, remember the password you set for user "postgres"
3. **Create Database**:
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter your password when prompted
   CREATE DATABASE indira_brainstorm;
   \q
   ```

4. **Update Backend .env**:
   - Open `backend\.env`
   - Update password in DATABASE_URL:
   - `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indira_brainstorm`

5. **Seed Database**:
   ```bash
   cd backend
   python seed_questions.py
   ```

---

## After Database Setup

Once database is configured and seeded, run:

### Terminal 1 - Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access Application:
Open browser: **http://localhost:5173**

---

## ✅ Recommendation

**Use Supabase (Option 1)** - It's faster, free, and doesn't require installing PostgreSQL locally.

---

## Need Help?

See the full README.md for detailed troubleshooting and setup instructions.
