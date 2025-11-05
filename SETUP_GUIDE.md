# TaxEase - Full Stack Setup Guide

Complete guide to run the MERN stack TaxEase application.

## Prerequisites

Before starting, ensure you have:
- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - Either:
  - Local installation - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)
- ✅ **Git** (optional, for version control)

## Quick Start

### Option 1: Local MongoDB

#### Step 1: Start MongoDB
Open a terminal and run:
```bash
mongod
```
Keep this terminal open.

#### Step 2: Start Backend Server
Open a new terminal:
```bash
cd backend
npm install
node utils/seedData.js
npm run dev
```

Backend will run on `http://localhost:5000`

#### Step 3: Start Frontend
Open another terminal:
```bash
cd ..
npm run dev
```

Frontend will run on `http://localhost:5173`

### Option 2: MongoDB Atlas (Cloud)

#### Step 1: Get MongoDB Connection String
1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taxease
   ```

#### Step 2-3: Same as Option 1 (skip mongod command)

## Detailed Setup

### Backend Setup

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   - Already created: `backend/.env`
   - Default settings:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/taxease
     NODE_ENV=development
     ```

4. **Seed sample data** (creates demo user with data):
   ```bash
   node utils/seedData.js
   ```
   
   **Important**: Copy the User ID shown in the output!

5. **Start backend server**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected: localhost
   ```

### Frontend Setup

1. **Navigate to project root**:
   ```bash
   cd ..
   ```

2. **Dependencies already installed** (axios added)

3. **Update User ID** (if needed):
   - Open `src/pages/Dashboard.jsx`
   - Line 52: Replace with User ID from seed script
   ```javascript
   const userId = 'YOUR_USER_ID_HERE';
   ```

4. **Start frontend**:
   ```bash
   npm run dev
   ```

   Opens at `http://localhost:5173`

## Testing the Application

### 1. Test Tax Calculator
- On Dashboard, enter income amount
- Select tax regime (New/Old)
- View calculated tax

### 2. Test Download Report
- Click "Download Report" button on Dashboard
- PDF will be generated and downloaded
- Contains: Income details, tax calculation, investments

### 3. Test AI Chatbot
- Click blue chat button (bottom-right)
- Ask: "How can I save tax?"
- Try quick questions

### 4. Navigate Pages
- Dashboard - Tax calculator & stats
- Investments - Investment options
- Reports - Tax reports with charts
- Profile - User profile

## API Testing (Optional)

### Using Thunder Client / Postman / cURL

#### Get Income Data
```bash
curl http://localhost:5000/api/income/YOUR_USER_ID?financialYear=2024-25
```

#### Get Investments
```bash
curl http://localhost:5000/api/investments/YOUR_USER_ID?financialYear=2024-25
```

#### Calculate Tax
```bash
curl -X POST http://localhost:5000/api/tax/calculate \
  -H "Content-Type: application/json" \
  -d '{"income": 1200000, "regime": "new", "deductions": 150000}'
```

## Troubleshooting

### Backend Issues

**Error: "MongoNetworkError"**
- Solution: Ensure MongoDB is running (`mongod`)
- Or check MongoDB Atlas connection string

**Error: "Port 5000 already in use"**
- Solution: Change PORT in `backend/.env` to 5001
- Update frontend `src/services/api.js` API_URL

**Error: "Income data not found" when downloading report**
- Solution: Run seed script: `node utils/seedData.js`

### Frontend Issues

**Error: "Network Error" or "Failed to fetch"**
- Solution: Ensure backend is running on port 5000
- Check browser console for details

**Download Report not working**
- Ensure backend is running
- Check User ID matches seeded data
- Open browser console to see errors

### MongoDB Issues

**Cannot connect to MongoDB**
- Windows: Start MongoDB service from Services
- Mac/Linux: Run `brew services start mongodb-community` or `sudo systemctl start mongod`

## Project Structure

```
TaxEase/
├── backend/
│   ├── config/         # Database config
│   ├── controllers/    # API logic
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Error handling
│   ├── utils/          # Seed data script
│   ├── .env           # Environment variables
│   ├── server.js      # Entry point
│   └── package.json
│
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── services/       # API calls
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

## Features Implemented

✅ MERN Stack Architecture
✅ RESTful API with Express
✅ MongoDB Database with Mongoose
✅ Income Management APIs
✅ Investment Tracking APIs
✅ Tax Calculation (New & Old Regime)
✅ PDF Report Generation (PDFKit)
✅ Download Tax Report Feature
✅ Real-time Data Fetching
✅ AI Chatbot (Frontend)
✅ Responsive UI with Tailwind CSS
✅ Animations with Framer Motion

## Next Steps for Production

1. Add user authentication (JWT)
2. Implement authorization & protected routes
3. Add input validation (express-validator)
4. Deploy backend to Heroku/Railway
5. Deploy frontend to Vercel/Netlify
6. Use MongoDB Atlas for production DB
7. Add environment-based configs
8. Implement error logging (Winston)
9. Add API rate limiting
10. Set up CI/CD pipeline

## Support

For issues or questions:
1. Check console logs (browser & terminal)
2. Verify all services are running
3. Ensure MongoDB connection
4. Check API endpoints with Postman

Happy coding! 🚀
