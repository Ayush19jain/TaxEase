import express from 'express';
import {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';

const router = express.Router();

router.route('/').post(createIncome);
router.route('/:userId').get(getIncome);
router.route('/:id').put(updateIncome).delete(deleteIncome);

export default router;
