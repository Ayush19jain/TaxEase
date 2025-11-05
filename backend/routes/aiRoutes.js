import express from 'express';
import {
  getAIRecommendations,
  getQuickRecommendations,
  checkAIServiceHealth,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/recommendations', protect, getAIRecommendations);
router.post('/recommendations/quick', getQuickRecommendations);

// Public health check
router.get('/health', checkAIServiceHealth);

export default router;
