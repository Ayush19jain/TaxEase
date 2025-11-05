import express from 'express';
import {
  getInvestments,
  getInvestmentSummary,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from '../controllers/investmentController.js';

const router = express.Router();

router.route('/').post(createInvestment);
router.route('/:userId').get(getInvestments);
router.route('/:userId/summary').get(getInvestmentSummary);
router.route('/:id').put(updateInvestment).delete(deleteInvestment);

export default router;
