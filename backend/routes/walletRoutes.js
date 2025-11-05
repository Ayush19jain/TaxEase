import express from 'express';
import {
  getWallet,
  addInvestment,
  updateInvestmentSlot,
  deleteInvestmentSlot,
  getWalletSummary,
  initializeWallet,
} from '../controllers/walletController.js';

const router = express.Router();

// Initialize wallet with default sections
router.post('/initialize', initializeWallet);

// Add investment to wallet
router.post('/add', addInvestment);

// Get wallet data and summary
router.get('/:userId', getWallet);
router.get('/:userId/summary', getWalletSummary);

// Update and delete investment slots
router.put('/:sectionId/slot/:slotId', updateInvestmentSlot);
router.delete('/:sectionId/slot/:slotId', deleteInvestmentSlot);

export default router;
