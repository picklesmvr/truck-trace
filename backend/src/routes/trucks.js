const express = require('express');
const { body, param } = require('express-validator');
const {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  getMyTruck,
  getTopTrucks
} = require('../controllers/truckController');
const { authMiddleware, ownerOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all trucks (public)
router.get('/', optionalAuth, getAllTrucks);

// Get top trucks (public)
router.get('/top', getTopTrucks);

// Get my truck (owner only)
router.get('/my', authMiddleware, ownerOnly, getMyTruck);

// Get truck by ID (public)
router.get('/:id', optionalAuth, getTruckById);

// Create truck (owner only)
const createTruckValidation = [
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

router.post('/', authMiddleware, ownerOnly, createTruckValidation, createTruck);

// Update truck (owner only)
const updateTruckValidation = [
  body('business_name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Business name must be between 2 and 255 characters'),
  body('truck_name')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('Truck name must be between 2 and 255 characters'),
  body('cuisine_types')
    .optional()
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

const truckIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid truck ID is required')
];

router.put('/:id', authMiddleware, ownerOnly, truckIdValidation, updateTruckValidation, updateTruck);

// Delete truck (owner only)
router.delete('/:id', authMiddleware, ownerOnly, truckIdValidation, deleteTruck);

module.exports = router;