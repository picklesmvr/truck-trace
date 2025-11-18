const express = require('express');
const { body } = require('express-validator');
const {
  registerCustomer,
  registerOwner,
  loginCustomer,
  loginOwner,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Customer registration validation
const customerRegistrationValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('profile_photo_url')
    .optional()
    .isURL()
    .withMessage('Profile photo URL must be a valid URL'),
  body('preferred_cuisines')
    .optional()
    .isArray()
    .withMessage('Preferred cuisines must be an array'),
  body('notification_radius_miles')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Notification radius must be between 1 and 50 miles')
];

// Owner registration validation
const ownerRegistrationValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('business_name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Business name must be between 2 and 255 characters'),
  body('truck_name')
    .isLength({ min: 2, max: 255 })
    .withMessage('Truck name must be between 2 and 255 characters'),
  body('cuisine_types')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine type must be selected'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  body('cover_photo_url')
    .optional()
    .isURL()
    .withMessage('Cover photo URL must be a valid URL'),
  body('contact_phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('social_links')
    .optional()
    .isObject()
    .withMessage('Social links must be an object')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

// Reset password validation
const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Registration routes
router.post('/register/customer', customerRegistrationValidation, registerCustomer);
router.post('/register/owner', ownerRegistrationValidation, registerOwner);

// Login routes
router.post('/login/customer', loginValidation, loginCustomer);
router.post('/login/owner', loginValidation, loginOwner);

// Password reset routes
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Get current user (requires authentication)
router.get('/me', authMiddleware, getMe);

module.exports = router;