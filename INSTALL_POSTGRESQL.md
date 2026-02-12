# PostgreSQL Local Installation Guide for Windows

## Step 1: Download PostgreSQL

1. **Go to**: https://www.postgresql.org/download/windows/
2. **Click**: "Download the installer" (from EDB)
3. **Choose**: Latest version (PostgreSQL 16 or 17)
4. **Download**: Windows x86-64 installer

---

## Step 2: Install PostgreSQL

1. **Run the installer** (postgresql-xx.x-x-windows-x64.exe)

2. **Installation Directory**: Keep default (`C:\Program Files\PostgreSQL\16`)

3. **Select Components**: Keep all selected:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Stack Builder
   - ✅ Command Line Tools

4. **Data Directory**: Keep default

5. **Set Password**: 
   - **IMPORTANT**: Choose a password for the "postgres" superuser
   - **Remember this password!** You'll need it later
   - Example: `postgres123` (use something secure)

6. **Port**: Keep default `5432`

7. **Locale**: Keep default

8. **Click Next** and wait for installation to complete

---

## Step 3: Verify Installation

After installation, PostgreSQL should be running as a Windows service.

**Check if PostgreSQL is running**:
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Look for "postgresql-x64-16" (or similar)
4. Status should be "Running"

---

## Step 4: Create Database

### Option A: Using pgAdmin (GUI - Easier)

1. **Open pgAdmin 4** (installed with PostgreSQL)
2. **Connect to server**:
   - Expand "Servers" → "PostgreSQL 16"
   - Enter the password you set during installation
3. **Create Database**:
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `indira_brainstorm`
   - Click "Save"

### Option B: Using Command Line

1. **Open Command Prompt or PowerShell**
2. **Navigate to PostgreSQL bin folder**:
   ```bash
   cd "C:\Program Files\PostgreSQL\16\bin"
   ```
3. **Connect to PostgreSQL**:
   ```bash
   psql -U postgres
   ```
   (Enter your password when prompted)

4. **Create database**:
   ```sql
   CREATE DATABASE indira_brainstorm;
   ```

5. **Verify**:
   ```sql
   \l
   ```
   (You should see `indira_brainstorm` in the list)

6. **Exit**:
   ```sql
   \q
   ```

---

## Step 5: Update Backend Configuration

1. **Open**: `c:\IU Quiz\backend\.env`

2. **Update DATABASE_URL** with your password:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/indira_brainstorm
   ```
   
   Example (if your password is `postgres123`):
   ```
   DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/indira_brainstorm
   ```

3. **Save the file**

---

## Step 6: Seed the Database

Run this command from the project root:

```bash
cd backend
python seed_questions.py
```

You should see:
```
✅ Successfully seeded 10 questions into the database!
Total questions in database: 10
```

---

## Step 7: Start the Application

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

### Access:
Open browser: **http://localhost:5173**

---

## Troubleshooting

### "psql: command not found"
- Add PostgreSQL to PATH:
  1. Search "Environment Variables" in Windows
  2. Edit "Path" variable
  3. Add: `C:\Program Files\PostgreSQL\16\bin`
  4. Restart terminal

### "Connection refused"
- Check if PostgreSQL service is running in `services.msc`
- Restart the service if needed

### "Password authentication failed"
- Double-check the password in `backend\.env`
- Make sure it matches the password you set during installation

---

## Quick Reference

**PostgreSQL Default Credentials**:
- Username: `postgres`
- Password: (what you set during installation)
- Host: `localhost`
- Port: `5432`
- Database: `indira_brainstorm`

**Connection String Format**:
```
postgresql://username:password@host:port/database_name
```

---

## Next Steps

After completing all steps above, let me know and I'll start both servers for you!
