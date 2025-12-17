# Quick Start Guide

## Prerequisites Check

### 1. Verify Java Installation
```bash
java -version
```
Should show Java 17 or higher.

If not installed: Download from https://adoptium.net/

### 2. Verify Maven Installation
```bash
mvn -version
```
Should show Maven 3.6 or higher.

If not installed: Download from https://maven.apache.org/download.cgi

### 3. Verify MongoDB is Running
```bash
# Check if MongoDB service is running
# On Windows, check Services app or run:
net start MongoDB
```

If not installed: Download from https://www.mongodb.com/try/download/community

### 4. Verify Node.js Installation
```bash
node -version
```
Should show Node.js 18 or higher.

If not installed: Download from https://nodejs.org/

## Running the Application

### Step 1: Start MongoDB
Make sure MongoDB is running on `localhost:27017`

### Step 2: Start the Backend (Terminal 1)
```bash
cd C:\Users\ayush\TaxEase-SpringBoot\backend
mvn clean install
mvn spring-boot:run
```

Wait for the message: `Started TaxEaseApplication in X seconds`

Backend will be running on: **http://localhost:8080**

### Step 3: Start the Frontend (Terminal 2)
```bash
cd C:\Users\ayush\TaxEase-SpringBoot
npm install
npm run dev
```

Frontend will be running on: **http://localhost:5173**

### Step 4: Open in Browser
Navigate to: **http://localhost:5173**

## Testing the Application

### 1. Sign Up
- Click "Sign Up" or navigate to `/signup`
- Enter name, email, and password
- Should redirect to dashboard

### 2. Add Income
- Go to Dashboard
- Add income details for a financial year
- Save

### 3. Add Investments
- Go to Investments page
- Add investment details (ELSS, PPF, etc.)
- Save

### 4. Calculate Tax
- Use the tax calculator on dashboard
- View tax breakdown

### 5. Generate Report
- Generate tax report
- Download PDF

## Troubleshooting

### Backend Issues

**Error: `Cannot connect to MongoDB`**
```bash
# Start MongoDB service
net start MongoDB
```

**Error: `Port 8080 already in use`**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <process_id> /F
```

**Error: `JAVA_HOME not set`**
```bash
# Set JAVA_HOME environment variable
# Point to your JDK installation directory
```

### Frontend Issues

**Error: `npm install` fails**
```bash
# Clear npm cache
npm cache clean --force
npm install
```

**Error: `Cannot connect to backend`**
- Verify backend is running on port 8080
- Check `src/services/api.js` has correct URL: `http://localhost:8080/api`

**Error: `CORS error`**
- Verify `cors.allowed-origins` in `backend/src/main/resources/application.properties`
- Should include: `http://localhost:5173`

## Quick Commands Reference

### Backend
```bash
# Build
cd backend && mvn clean install

# Run
mvn spring-boot:run

# Run tests
mvn test

# Package as JAR
mvn clean package

# Run packaged JAR
java -jar target/taxease-backend-1.0.0.jar
```

### Frontend
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Default Configuration

### Backend (application.properties)
- Server Port: `8080`
- MongoDB URI: `mongodb://localhost:27017/taxease`
- JWT Expiration: `30 days`
- Context Path: `/api`

### Frontend
- Dev Server Port: `5173`
- API Base URL: `http://localhost:8080/api`

## Next Steps

1. **Change JWT Secret**: Edit `jwt.secret` in `application.properties`
2. **Configure MongoDB**: Update MongoDB URI if using remote database
3. **Add Test Data**: Use the seed scripts or add data through UI
4. **Explore API**: Test endpoints using Postman or curl

## API Documentation

Base URL: `http://localhost:8080/api`

### Authentication
- POST `/auth/signup` - Register
- POST `/auth/login` - Login
- GET `/auth/me` - Get current user (requires JWT)

### Income
- GET `/income/{userId}` - Get income
- POST `/income` - Create income
- PUT `/income/{id}` - Update income
- DELETE `/income/{id}` - Delete income

### Investments
- GET `/investments/{userId}` - Get investments
- GET `/investments/{userId}/summary` - Get summary
- POST `/investments` - Create investment
- PUT `/investments/{id}` - Update investment
- DELETE `/investments/{id}` - Delete investment

### Tax
- POST `/tax/calculate` - Calculate tax
- POST `/tax/report` - Generate report
- GET `/tax/reports/{userId}` - Get all reports
- GET `/tax/report/{reportId}/download` - Download PDF

## Support

For detailed information, see:
- `README.md` - Full documentation
- `MIGRATION_SUMMARY.md` - Migration details
