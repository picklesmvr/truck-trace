const express = require('express');
const { body, param } = require('express-validator');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getFavoriteTrucks
} = require('../controllers/favoriteController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user's favorites (with optional location filtering)
router.get('/', authMiddleware, getFavorites);

// Get user's favorite trucks (simplified list)
router.get('/trucks', authMiddleware, getFavoriteTrucks);

// Check if truck is in favorites
const checkFavoriteValidation = [
  param('truck_id')
    .isUUID()
    .withMessage('Valid truck ID is required')
];

router.get('/check/:truck_id', authMiddleware, checkFavoriteValidation, isFavorite);

// Add truck to favorites
const addFavoriteValidation = [
  body('truck_id')
    .isUUID()
    .withMessage('Valid truck ID is required')
];

router.post('/', authMiddleware, addFavoriteValidation, addFavorite);

// Remove truck from favorites
const removeFavoriteValidation = [
  body('truck_id')
    .isUUID()
    .withMessage('Valid truck ID is required')
];

router.delete('/', authMiddleware, removeFavoriteValidation, removeFavorite);

module.exports = router;