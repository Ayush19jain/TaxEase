import asyncHandler from 'express-async-handler';
import PDFDocument from 'pdfkit';
import TaxReport from '../models/TaxReport.js';
import Income from '../models/Income.js';
import Investment from '../models/Investment.js';
import User from '../models/User.js';

// Tax calculation helper
const calculateTax = (income, regime) => {
  if (regime === 'new') {
    if (income <= 300000) return 0;
    if (income <= 600000) return (income - 300000) * 0.05;
    if (income <= 900000) return 15000 + (income - 600000) * 0.10;
    if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
    if (income <= 1500000) return 90000 + (income - 1200000) * 0.20;
    return 150000 + (income - 1500000) * 0.30;
  } else {
    // Old regime
    if (income <= 250000) return 0;
    if (income <= 500000) return (income - 250000) * 0.05;
    if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
    return 112500 + (income - 1000000) * 0.30;
  }
};

// @desc    Calculate tax
// @route   POST /api/tax/calculate
// @access  Public
export const calculateTaxAmount = asyncHandler(async (req, res) => {
  const { income, regime, deductions } = req.body;

  const taxableIncome = income - (deductions || 0);
  const taxAmount = calculateTax(taxableIncome, regime);

  res.json({
    income,
    deductions: deductions || 0,
    taxableIncome,
    taxAmount,
    regime,
    netIncome: income - taxAmount,
  });
});

// @desc    Generate and save tax report
// @route   POST /api/tax/report
// @access  Public
export const generateTaxReport = asyncHandler(async (req, res) => {
  const { userId, financialYear, regime } = req.body;

  // Get income data
  const incomeData = await Income.findOne({ userId, financialYear });
  if (!incomeData) {
    res.status(404);
    throw new Error('Income data not found');
  }

  // Get investments
  const investments = await Investment.find({ userId, financialYear });
  const totalDeductions = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Calculate tax
  const taxableIncome = incomeData.totalIncome - Math.min(totalDeductions, 150000);
  const taxAmount = calculateTax(taxableIncome, regime);

  // Create report
  const report = await TaxReport.create({
    userId,
    financialYear,
    totalIncome: incomeData.totalIncome,
    totalDeductions,
    taxableIncome,
    taxAmount,
    regime,
    taxBreakdown: {
      income: incomeData.totalIncome,
      tax: taxAmount,
      healthInsurance: 350,
    },
    investments: investments.map(inv => inv._id),
  });

  await report.populate('investments');
  res.status(201).json(report);
});

// @desc    Get tax reports
// @route   GET /api/tax/reports/:userId
// @access  Public
export const getTaxReports = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reports = await TaxReport.find({ userId })
    .populate('investments')
    .sort({ createdAt: -1 });
  
  res.json(reports);
});

// @desc    Download tax report as PDF
// @route   GET /api/tax/report/:reportId/download
// @access  Public
export const downloadTaxReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;

  const report = await TaxReport.findById(reportId)
    .populate('userId')
    .populate('investments');

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=tax-report-${report.financialYear}.pdf`);

  // Pipe PDF to response
  doc.pipe(res);

  // Add content to PDF
  doc.fontSize(24).font('Helvetica-Bold').text('Tax Report', { align: 'center' });
  doc.moveDown();
  
  doc.fontSize(12).font('Helvetica').text(`Financial Year: ${report.financialYear}`);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`);
  doc.text(`Taxpayer: ${report.userId.name}`);
  if (report.userId.pan) {
    doc.text(`PAN: ${report.userId.pan}`);
  }
  doc.moveDown();

  // Income Section
  doc.fontSize(16).font('Helvetica-Bold').text('Income Details');
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica');
  doc.text(`Total Income: ₹${report.totalIncome.toLocaleString('en-IN')}`);
  doc.text(`Total Deductions: ₹${report.totalDeductions.toLocaleString('en-IN')}`);
  doc.text(`Taxable Income: ₹${report.taxableIncome.toLocaleString('en-IN')}`);
  doc.moveDown();

  // Tax Calculation
  doc.fontSize(16).font('Helvetica-Bold').text('Tax Calculation');
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica');
  doc.text(`Tax Regime: ${report.regime === 'new' ? 'New Regime' : 'Old Regime'}`);
  doc.text(`Tax Amount: ₹${report.taxAmount.toLocaleString('en-IN')}`);
  doc.text(`Net Income: ₹${(report.totalIncome - report.taxAmount).toLocaleString('en-IN')}`);
  doc.moveDown();

  // Investments
  if (report.investments && report.investments.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Investments');
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica');
    
    report.investments.forEach((inv, index) => {
      doc.text(`${index + 1}. ${inv.type} - ₹${inv.amount.toLocaleString('en-IN')} (Section ${inv.section})`);
    });
    doc.moveDown();
  }

  // Tax Breakdown
  doc.fontSize(16).font('Helvetica-Bold').text('Tax Breakdown');
  doc.moveDown(0.5);
  doc.fontSize(12).font('Helvetica');
  if (report.taxBreakdown) {
    doc.text(`Income: ₹${report.taxBreakdown.income.toLocaleString('en-IN')}`);
    doc.text(`Tax: ₹${report.taxBreakdown.tax.toLocaleString('en-IN')}`);
    if (report.taxBreakdown.healthInsurance) {
      doc.text(`Health Insurance: ₹${report.taxBreakdown.healthInsurance.toLocaleString('en-IN')}`);
    }
  }

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).font('Helvetica').text('This is a system-generated report.', { align: 'center' });
  doc.text('TaxEase - Your Tax Planning Companion', { align: 'center' });

  // Finalize PDF
  doc.end();
});
