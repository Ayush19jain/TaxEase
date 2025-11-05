import asyncHandler from 'express-async-handler';
import Investment from '../models/Investment.js';

// @desc    Get all investments for a user
// @route   GET /api/investments/:userId
// @access  Public
export const getInvestments = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { financialYear } = req.query;

  const query = { userId };
  if (financialYear) {
    query.financialYear = financialYear;
  }

  const investments = await Investment.find(query).sort({ createdAt: -1 });
  res.json(investments);
});

// @desc    Get investment summary
// @route   GET /api/investments/:userId/summary
// @access  Public
export const getInvestmentSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { financialYear } = req.query;

  const query = { userId };
  if (financialYear) {
    query.financialYear = financialYear;
  }

  const investments = await Investment.find(query);

  const summary = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    section80C: investments
      .filter(inv => inv.section === '80C')
      .reduce((sum, inv) => sum + inv.amount, 0),
    section80CCD: investments
      .filter(inv => inv.section === '80CCD(1B)')
      .reduce((sum, inv) => sum + inv.amount, 0),
    section80D: investments
      .filter(inv => inv.section === '80D')
      .reduce((sum, inv) => sum + inv.amount, 0),
    byType: investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
      return acc;
    }, {}),
  };

  res.json(summary);
});

// @desc    Create new investment
// @route   POST /api/investments
// @access  Public
export const createInvestment = asyncHandler(async (req, res) => {
  const { userId, financialYear, type, amount, section, returns, description } = req.body;

  const investment = await Investment.create({
    userId,
    financialYear,
    type,
    amount,
    section: section || '80C',
    returns: returns || 0,
    description,
  });

  res.status(201).json(investment);
});

// @desc    Update investment
// @route   PUT /api/investments/:id
// @access  Public
export const updateInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id);

  if (!investment) {
    res.status(404);
    throw new Error('Investment not found');
  }

  const updatedInvestment = await Investment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedInvestment);
});

// @desc    Delete investment
// @route   DELETE /api/investments/:id
// @access  Public
export const deleteInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findById(req.params.id);

  if (!investment) {
    res.status(404);
    throw new Error('Investment not found');
  }

  await investment.deleteOne();
  res.json({ message: 'Investment deleted' });
});
