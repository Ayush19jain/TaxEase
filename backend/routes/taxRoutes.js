import express from 'express';
import {
  calculateTaxAmount,
  generateTaxReport,
  getTaxReports,
  downloadTaxReport,
} from '../controllers/taxController.js';

const router = express.Router();

router.post('/calculate', calculateTaxAmount);
router.post('/report', generateTaxReport);
router.get('/reports/:userId', getTaxReports);
router.get('/report/:reportId/download', downloadTaxReport);

export default router;
