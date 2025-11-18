const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getNearbyTrucks,
  createLocation,
  updateLocation,
  deleteLocation,
  getTruckLocations,
  getCurrentLocation
} = require('../controllers/locationController');
const { authMiddleware, ownerOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get nearby trucks (public)
const nearbyValidation = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required (-90 to 90)'),
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required (-180 to 180)'),
  query('radius')
    .optional()
    .isFloat({ min: 0.5, max: 50 })
    .withMessage('Radius must be between 0.5 and 50 miles')
];

router.get('/nearby', nearbyValidation, getNearbyTrucks);

// Get truck locations (public)
const truckLocationsValidation = [
  query('truck_id')
    .isUUID()
    .withMessage('Valid truck ID is required'),
  query('include_scheduled')
    .optional()
    .isBoolean()
    .withMessage('include_scheduled must be a boolean')
];

router.get('/', truckLocationsValidation, getTruckLocations);

// Get current location for truck (public)
const currentLocationValidation = [
  query('truck_id')
    .isUUID()
    .withMessage('Valid truck ID is required')
];

router.get('/current', currentLocationValidation, getCurrentLocation);

// Create location (owner only)
const createLocationValidation = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required (-90 to 90)'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required (-180 to 180)'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('scheduled_start')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('scheduled_end')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('is_current')
    .optional()
    .isBoolean()
    .withMessage('is_current must be a boolean'),
  body('status')
    .optional()
    .isIn(['open', 'closing_soon', 'closed'])
    .withMessage('Status must be one of: open, closing_soon, closed')
];

router.post('/', authMiddleware, ownerOnly, createLocationValidation, createLocation);

// Update location (owner only)
const updateLocationValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid location ID is required'),
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude is required (-90 to 90)'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude is required (-180 to 180)'),
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('scheduled_start')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('scheduled_end')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('is_current')
    .optional()
    .isBoolean()
    .withMessage('is_current must be a boolean'),
  body('status')
    .optional()
    .isIn(['open', 'closing_soon', 'closed'])
    .withMessage('Status must be one of: open, closing_soon, closed')
];

router.put('/:id', authMiddleware, ownerOnly, updateLocationValidation, updateLocation);

// Delete location (owner only)
const deleteLocationValidation = [
  param('id')
    .isUUID()
    .withMessage('Valid location ID is required')
];

router.delete('/:id', authMiddleware, ownerOnly, deleteLocationValidation, deleteLocation);

module.exports = router;