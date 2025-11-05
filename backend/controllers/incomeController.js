import asyncHandler from 'express-async-handler';
import Income from '../models/Income.js';

// @desc    Get all income records for a user
// @route   GET /api/income/:userId
// @access  Public
export const getIncome = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { financialYear } = req.query;

  const query = { userId };
  if (financialYear) {
    query.financialYear = financialYear;
  }

  const incomeRecords = await Income.find(query).sort({ createdAt: -1 });
  res.json(incomeRecords);
});

// @desc    Create new income record
// @route   POST /api/income
// @access  Public
export const createIncome = asyncHandler(async (req, res) => {
  const { userId, financialYear, salary, businessIncome, capitalGains, otherIncome } = req.body;

  const income = await Income.create({
    userId,
    financialYear,
    salary: salary || 0,
    businessIncome: businessIncome || 0,
    capitalGains: capitalGains || 0,
    otherIncome: otherIncome || 0,
    totalIncome: 0, // Will be calculated by pre-save hook
  });

  res.status(201).json(income);
});

// @desc    Update income record
// @route   PUT /api/income/:id
// @access  Public
export const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(404);
    throw new Error('Income record not found');
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedIncome);
});

// @desc    Delete income record
// @route   DELETE /api/income/:id
// @access  Public
export const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findById(req.params.id);

  if (!income) {
    res.status(404);
    throw new Error('Income record not found');
  }

  await income.deleteOne();
  res.json({ message: 'Income record deleted' });
});
