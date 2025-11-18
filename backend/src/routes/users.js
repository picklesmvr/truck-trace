const express = require('express');
const { body } = require('express-validator');
const {
  updateProfile,
  getProfile,
  changePassword
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile', authMiddleware, getProfile);

// Update profile
const updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
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
    .withMessage('Notification radius must be between 1 and 50 miles'),
  body('push_notifications_enabled')
    .optional()
    .isBoolean()
    .withMessage('Push notifications enabled must be a boolean')
];

router.put('/profile', authMiddleware, updateProfileValidation, updateProfile);

// Change password
const changePasswordValidation = [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

router.put('/password', authMiddleware, changePasswordValidation, changePassword);

module.exports = router;