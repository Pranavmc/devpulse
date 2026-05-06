const { Router } = require('express');
const { createUrl, listUrls, deleteUrl, redirect } = require('../controllers/urlController');
const authenticate = require('../middleware/authenticate');

const router = Router();

// Authenticated routes
router.post('/api/urls', authenticate, createUrl);
router.get('/api/urls', authenticate, listUrls);
router.delete('/api/urls/:shortCode', authenticate, deleteUrl);

// Public redirect endpoint
router.get('/r/:shortCode', redirect);

module.exports = router;
