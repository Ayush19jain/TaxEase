import asyncHandler from 'express-async-handler';
import UserInvestments from '../models/UserInvestments.js';

// Default section limits
const SECTION_LIMITS = {
  '80C': 150000,
  '80CCD(1B)': 50000,
  '80D': 25000,
  '80DD': 75000,
  '80DDB': 40000,
  '80E': 0, // No limit
  '80G': 0, // No limit
  '80TTA': 10000,
};

// @desc    Get wallet data for a user
// @route   GET /api/wallet/:userId
// @access  Public
export const getWallet = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { financialYear } = req.query;

  if (!financialYear) {
    res.status(400);
    throw new Error('Financial year is required');
  }

  const walletData = await UserInvestments.find({ userId, financialYear }).sort({ section: 1 });

  // Calculate totals and format response
  const response = walletData.map(section => ({
    _id: section._id,
    section: section.section,
    limit: section.limit,
    invested: section.invested,
    remaining: section.getRemainingLimit(),
    progress: section.getProgressPercentage(),
    slots: section.slots,
    lastUpdated: section.lastUpdated,
  }));

  res.json(response);
});

// @desc    Add investment to wallet
// @route   POST /api/wallet/add
// @access  Public
export const addInvestment = asyncHandler(async (req, res) => {
  const { userId, financialYear, section, name, amount } = req.body;

  if (!userId || !financialYear || !section || !name || !amount) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (amount <= 0) {
    res.status(400);
    throw new Error('Amount must be greater than 0');
  }

  // Check if section exists
  let sectionDoc = await UserInvestments.findOne({ userId, financialYear, section });

  if (sectionDoc) {
    // Check if adding this amount exceeds the limit
    const newInvested = sectionDoc.invested + amount;
    if (sectionDoc.limit > 0 && newInvested > sectionDoc.limit) {
      res.status(400);
      throw new Error(`Adding ₹${amount} exceeds section limit of ₹${sectionDoc.limit}`);
    }

    // Add slot to existing section
    sectionDoc.slots.push({ name, amount });
    await sectionDoc.save();
  } else {
    // Create new section
    const limit = SECTION_LIMITS[section] || 0;
    
    if (limit > 0 && amount > limit) {
      res.status(400);
      throw new Error(`Amount ₹${amount} exceeds section limit of ₹${limit}`);
    }

    sectionDoc = await UserInvestments.create({
      userId,
      financialYear,
      section,
      limit,
      slots: [{ name, amount }],
    });
  }

  // Return formatted response
  res.status(201).json({
    _id: sectionDoc._id,
    section: sectionDoc.section,
    limit: sectionDoc.limit,
    invested: sectionDoc.invested,
    remaining: sectionDoc.getRemainingLimit(),
    progress: sectionDoc.getProgressPercentage(),
    slots: sectionDoc.slots,
    lastUpdated: sectionDoc.lastUpdated,
  });
});

// @desc    Update investment slot
// @route   PUT /api/wallet/:sectionId/slot/:slotId
// @access  Public
export const updateInvestmentSlot = asyncHandler(async (req, res) => {
  const { sectionId, slotId } = req.params;
  const { name, amount } = req.body;

  const sectionDoc = await UserInvestments.findById(sectionId);

  if (!sectionDoc) {
    res.status(404);
    throw new Error('Section not found');
  }

  const slot = sectionDoc.slots.id(slotId);

  if (!slot) {
    res.status(404);
    throw new Error('Investment slot not found');
  }

  // Calculate new invested amount
  const oldAmount = slot.amount;
  const newInvested = sectionDoc.invested - oldAmount + (amount || slot.amount);

  if (sectionDoc.limit > 0 && newInvested > sectionDoc.limit) {
    res.status(400);
    throw new Error(`Update exceeds section limit of ₹${sectionDoc.limit}`);
  }

  if (name) slot.name = name;
  if (amount) slot.amount = amount;

  await sectionDoc.save();

  res.json({
    _id: sectionDoc._id,
    section: sectionDoc.section,
    limit: sectionDoc.limit,
    invested: sectionDoc.invested,
    remaining: sectionDoc.getRemainingLimit(),
    progress: sectionDoc.getProgressPercentage(),
    slots: sectionDoc.slots,
    lastUpdated: sectionDoc.lastUpdated,
  });
});

// @desc    Delete investment slot
// @route   DELETE /api/wallet/:sectionId/slot/:slotId
// @access  Public
export const deleteInvestmentSlot = asyncHandler(async (req, res) => {
  const { sectionId, slotId } = req.params;

  const sectionDoc = await UserInvestments.findById(sectionId);

  if (!sectionDoc) {
    res.status(404);
    throw new Error('Section not found');
  }

  const slot = sectionDoc.slots.id(slotId);

  if (!slot) {
    res.status(404);
    throw new Error('Investment slot not found');
  }

  // Remove the slot
  slot.deleteOne();
  await sectionDoc.save();

  // If no slots left, optionally delete the section
  if (sectionDoc.slots.length === 0) {
    await sectionDoc.deleteOne();
    res.json({ message: 'Investment deleted and section removed' });
  } else {
    res.json({
      message: 'Investment slot deleted',
      section: {
        _id: sectionDoc._id,
        section: sectionDoc.section,
        limit: sectionDoc.limit,
        invested: sectionDoc.invested,
        remaining: sectionDoc.getRemainingLimit(),
        progress: sectionDoc.getProgressPercentage(),
        slots: sectionDoc.slots,
        lastUpdated: sectionDoc.lastUpdated,
      },
    });
  }
});

// @desc    Get wallet summary
// @route   GET /api/wallet/:userId/summary
// @access  Public
export const getWalletSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { financialYear } = req.query;

  if (!financialYear) {
    res.status(400);
    throw new Error('Financial year is required');
  }

  const walletData = await UserInvestments.find({ userId, financialYear });

  const summary = {
    totalInvested: walletData.reduce((sum, section) => sum + section.invested, 0),
    totalLimit: walletData.reduce((sum, section) => sum + section.limit, 0),
    totalRemaining: walletData.reduce((sum, section) => sum + section.getRemainingLimit(), 0),
    bySections: walletData.map(section => ({
      section: section.section,
      invested: section.invested,
      limit: section.limit,
      remaining: section.getRemainingLimit(),
      progress: section.getProgressPercentage(),
    })),
  };

  res.json(summary);
});

// @desc    Initialize default sections for a user
// @route   POST /api/wallet/initialize
// @access  Public
export const initializeWallet = asyncHandler(async (req, res) => {
  const { userId, financialYear, sections } = req.body;

  if (!userId || !financialYear || !sections || !Array.isArray(sections)) {
    res.status(400);
    throw new Error('userId, financialYear, and sections array are required');
  }

  const createdSections = [];

  for (const section of sections) {
    // Check if section already exists
    const existing = await UserInvestments.findOne({ userId, financialYear, section });
    
    if (!existing) {
      const limit = SECTION_LIMITS[section] || 0;
      const newSection = await UserInvestments.create({
        userId,
        financialYear,
        section,
        limit,
        slots: [],
      });
      createdSections.push(newSection);
    }
  }

  res.status(201).json({
    message: 'Wallet initialized',
    sections: createdSections,
  });
});
