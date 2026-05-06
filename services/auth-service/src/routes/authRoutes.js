const { Router } = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name must be at most 100 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Valid email is required')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  login
);

router.get('/me', authenticate, me);

module.exports = router;
