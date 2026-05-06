const { Router } = require('express');
const { getSummary, getTimeline, getDashboard } = require('../controllers/analyticsController');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.get('/api/analytics/dashboard', authenticate, getDashboard);
router.get('/api/analytics/:shortCode/summary', authenticate, getSummary);
router.get('/api/analytics/:shortCode/timeline', authenticate, getTimeline);

module.exports = router;
