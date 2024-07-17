import express from 'express';
import { getSalesAnalytics, getUserAnalytics, getHighestReviewedProduct, getOrderStats, getProductStats } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/sales').get(protect, admin, getSalesAnalytics);
router.route('/users').get(protect, admin, getUserAnalytics);
router.route('/highest-reviewed').get(protect, admin, getHighestReviewedProduct);
router.route('/orders').get(protect, admin, getOrderStats);
router.route('/products').get(protect, admin, getProductStats);

export default router;