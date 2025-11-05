# TaxEase - Complete VS Code Setup Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v16 or higher) installed
- ✅ Python (v3.9 or higher) installed
- ✅ MongoDB installed and running
- ✅ VS Code installed

---

## Step-by-Step Setup

### 1. Open Project in VS Code

```powershell
# Navigate to project directory
cd C:\Users\ayush\TaxEase

# Open in VS Code
code .
```

---

## Terminal Setup (3 Terminals Required)

In VS Code, you'll need **3 integrated terminals**:
- **Terminal 1:** Python AI Service (Port 8000)
- **Terminal 2:** Node.js Backend (Port 5000)
- **Terminal 3:** React Frontend (Port 5173)

### How to Open Multiple Terminals in VS Code:
1. Press `` Ctrl + ` `` to open integrated terminal
2. Click the **`+`** icon to create new terminals
3. Or use: `Terminal` → `New Terminal` (Repeat 3 times)

---

## Terminal 1: Python AI Service (Port 8000)

```powershell
# Navigate to AI service directory
cd ai-service

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (first time only)
pip install -r requirements.txt

# Run the AI service
uvicorn app:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal running!**

---

## Terminal 2: Node.js Backend (Port 5000)

```powershell
# Navigate to backend directory (from root)
cd backend

# Install dependencies (first time only)
npm install

# Run backend in development mode
npm run dev
```

**You should see:**
```
[nodemon] starting `node server.js`
MongoDB connected successfully
Server running on port 5000
```

**Keep this terminal running!**

---

## Terminal 3: React Frontend (Port 5173)

```powershell
# Navigate to root directory (if not already there)
cd ..

# Or from root:
# (just ensure you're in C:\Users\ayush\TaxEase)

# Install dependencies (first time only)
npm install

# Run frontend development server
npm run dev
```

**You should see:**
```
ROLLDOWN-VITE v7.1.14  ready in 199 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running!**

---

## Quick Start Script

Create this file to start everything at once:

### Create `start-all.ps1` in root directory:

```powershell
# Save this as: start-all.ps1

# Start MongoDB (adjust path if different)
Write-Host "Starting MongoDB..." -ForegroundColor Cyan
Start-Process "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" -ArgumentList "--dbpath", "C:\data\db" -WindowStyle Minimized

# Wait for MongoDB to start
Start-Sleep -Seconds 3

# Start AI Service
Write-Host "Starting AI Service..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; .\venv\Scripts\Activate.ps1; uvicorn app:app --reload --port 8000"

# Wait for AI service
Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

# Wait for backend
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "Open browser: http://localhost:5173" -ForegroundColor Cyan
```

**Run it:**
```powershell
.\start-all.ps1
```

---

## Verify Everything is Running

### Check AI Service (Port 8000):
```powershell
curl http://localhost:8000/health
```
**Expected:** `{"status":"healthy","model_loaded":true}`

### Check Backend (Port 5000):
```powershell
curl http://localhost:5000
```
**Expected:** `{"message":"TaxEase API is running..."}`

### Check Frontend (Port 5173):
Open browser: **http://localhost:5173**

---

## VS Code Extensions (Recommended)

Install these extensions for better development:

1. **ES7+ React/Redux/React-Native snippets** - `dsznajder.es7-react-js-snippets`
2. **Python** - `ms-python.python`
3. **Pylance** - `ms-python.vscode-pylance`
4. **ESLint** - `dbaeumer.vscode-eslint`
5. **Prettier** - `esbenp.prettier-vscode`
6. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
7. **MongoDB for VS Code** - `mongodb.mongodb-vscode`

**Install via VS Code:**
- Press `Ctrl + Shift + X`
- Search and install each extension

---

## VS Code Settings (Optional)

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "files.exclude": {
    "**/__pycache__": true,
    "**/node_modules": true,
    "**/.venv": true
  }
}
```

---

## Debugging in VS Code

### Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app:app",
        "--reload",
        "--port",
        "8000"
      ],
      "cwd": "${workspaceFolder}/ai-service",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/ai-service"
      }
    },
    {
      "name": "Node: Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

**To debug:**
1. Press `F5` or go to `Run and Debug` panel
2. Select configuration
3. Start debugging

---

## Common Issues & Solutions

### Issue 1: Python virtual environment not activating
```powershell
# Enable script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 2: Port already in use
```powershell
# Find process using port (e.g., 5000)
netstat -ano | findstr :5000

# Kill process by PID
taskkill /PID <PID> /F
```

### Issue 3: MongoDB not running
```powershell
# Start MongoDB manually
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### Issue 4: npm/node not found
```powershell
# Verify installation
node --version
npm --version

# If not installed, download from nodejs.org
```

### Issue 5: Python not found
```powershell
# Verify installation
python --version

# If not installed, download from python.org
```

---

## Quick Commands Reference

| Task | Command |
|------|---------|
| Open VS Code | `code .` |
| New terminal | `` Ctrl + Shift + ` `` |
| Run AI service | `cd ai-service; .\venv\Scripts\Activate.ps1; uvicorn app:app --reload --port 8000` |
| Run backend | `cd backend; npm run dev` |
| Run frontend | `npm run dev` |
| Stop all | `Ctrl + C` in each terminal |
| Check ports | `netstat -ano \| findstr :8000` |
| Clear terminal | `cls` |

---

## Testing the Application

### 1. Open Browser
```
http://localhost:5173
```

### 2. Sign Up
- Click "Sign Up"
- Enter your details
- Create account

### 3. Explore Features
- ✅ Dashboard
- ✅ AI Tax Assistant (Click the sparkles icon ✨)
- ✅ Investments
- ✅ Reports (Generate PDF)
- ✅ Profile

### 4. Test AI Assistant
1. Navigate to "AI Assistant"
2. Fill in financial details
3. Click "Get AI Recommendations"
4. View personalized suggestions!

---

## Stopping the Application

### Stop Individual Services:
- Press `Ctrl + C` in each terminal

### Stop All at Once:
```powershell
# Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill all Python processes
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## Development Workflow

### Daily Startup:
1. Open VS Code: `code .`
2. Open 3 terminals
3. Start services (AI → Backend → Frontend)
4. Develop and test
5. Changes auto-reload (hot reload enabled)

### Before Committing:
```powershell
# Run linting
npm run lint

# Format code (if configured)
npm run format
```

---

## Project Structure

```
TaxEase/
├── ai-service/          # Python FastAPI service
│   ├── venv/           # Virtual environment
│   ├── app.py          # Main FastAPI app
│   └── requirements.txt
├── backend/            # Node.js Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/                # React frontend
│   ├── pages/
│   ├── components/
│   └── services/
├── package.json        # Frontend dependencies
└── .vscode/           # VS Code settings
```

---

## Need Help?

- **Frontend issues:** Check browser console (F12)
- **Backend issues:** Check Terminal 2 logs
- **AI service issues:** Check Terminal 1 logs
- **Database issues:** Verify MongoDB is running

---

## Success! 🎉

You should now have:
- ✅ VS Code open with project
- ✅ 3 terminals running services
- ✅ Browser showing TaxEase at http://localhost:5173
- ✅ AI Tax Assistant working
- ✅ PDF reports generating

**Happy coding!** 💻
