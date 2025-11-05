# TaxEase Backend API

MERN stack backend for TaxEase - Tax Calculation and Investment Planning Platform.

## Features

- **Income Management**: Track and manage income from various sources
- **Investment Tracking**: Monitor investments with tax benefits
- **Tax Calculation**: Calculate tax under New and Old regimes
- **PDF Report Generation**: Download detailed tax reports as PDF
- **Real-time Data**: RESTful APIs for real-time income and investment updates

## Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **PDFKit** - PDF generation
- **CORS** - Cross-origin resource sharing

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

### Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taxease
   NODE_ENV=development
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Seed sample data** (optional):
   ```bash
   node utils/seedData.js
   ```
   This will create a sample user with income and investment data.

5. **Start the server**:
   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

## API Endpoints

### Income APIs

- `GET /api/income/:userId` - Get all income records
- `POST /api/income` - Create new income record
- `PUT /api/income/:id` - Update income record
- `DELETE /api/income/:id` - Delete income record

### Investment APIs

- `GET /api/investments/:userId` - Get all investments
- `GET /api/investments/:userId/summary` - Get investment summary
- `POST /api/investments` - Create new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment

### Tax & Report APIs

- `POST /api/tax/calculate` - Calculate tax amount
- `POST /api/tax/report` - Generate tax report
- `GET /api/tax/reports/:userId` - Get all tax reports
- `GET /api/tax/report/:reportId/download` - Download PDF report

## Data Models

### User
- name, email, PAN, phone, taxRegime

### Income
- userId, financialYear, salary, businessIncome, capitalGains, otherIncome, totalIncome

### Investment
- userId, financialYear, type (ELSS, PPF, NPS, etc.), amount, section (80C, 80CCD, etc.), returns

### TaxReport
- userId, financialYear, totalIncome, totalDeductions, taxableIncome, taxAmount, regime

## Tax Calculation

### New Regime
- 0-3L: 0%
- 3-6L: 5%
- 6-9L: 10%
- 9-12L: 15%
- 12-15L: 20%
- 15L+: 30%

### Old Regime
- 0-2.5L: 0%
- 2.5-5L: 5%
- 5-10L: 20%
- 10L+: 30%

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node utils/seedData.js` - Seed sample data

## Notes

- For production, update MONGODB_URI in `.env` to use MongoDB Atlas
- Implement authentication/authorization for production use
- Add input validation and sanitization
- Consider adding rate limiting and security headers
