const { validationResult } = require('express-validator');
const Favorite = require('../models/Favorite');
const FoodTruck = require('../models/FoodTruck');

const addFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { truck_id } = req.body;

    // Check if truck exists
    const truck = await FoodTruck.findById(truck_id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    const favorite = await Favorite.create({
      user_id: req.user.id,
      truck_id
    });

    if (!favorite) {
      return res.status(400).json({
        success: false,
        message: 'Truck is already in your favorites'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Truck added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding favorite'
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { truck_id } = req.body;

    const success = await Favorite.remove(req.user.id, truck_id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Truck removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing favorite'
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;

    let favorites = await Favorite.getFavoriteTrucks(req.user.id);

    // If location provided, calculate distances and filter
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const radiusMiles = parseFloat(radius);

      favorites = favorites.map(favorite => {
        if (favorite.latitude && favorite.longitude) {
          // Calculate distance using Haversine formula (simplified)
          const distance = calculateDistance(userLat, userLng, favorite.latitude, favorite.longitude);
          return {
            ...favorite,
            distance_miles: distance,
            is_within_radius: distance <= radiusMiles
          };
        }
        return {
          ...favorite,
          distance_miles: null,
          is_within_radius: false
        };
      });
    }

    res.json({
      success: true,
      data: {
        favorites,
        count: favorites.length
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching favorites'
    });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { truck_id } = req.params;

    const isFav = await Favorite.isFavorite(req.user.id, truck_id);

    res.json({
      success: true,
      data: {
        is_favorite: isFav
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking favorite status'
    });
  }
};

const getFavoriteTrucks = async (req, res) => {
  try {
    const favoriteTrucks = await Favorite.getFavoriteTrucks(req.user.id);

    res.json({
      success: true,
      data: {
        trucks: favoriteTrucks,
        count: favoriteTrucks.length
      }
    });
  } catch (error) {
    console.error('Get favorite trucks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching favorite trucks'
    });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorite,
  getFavoriteTrucks
};