const { validationResult } = require('express-validator');
const FoodTruck = require('../models/FoodTruck');
const MenuItem = require('../models/MenuItem');
const Location = require('../models/Location');

const getAllTrucks = async (req, res) => {
  try {
    const {
      cuisine_types,
      search,
      limit,
      lat,
      lng,
      radius = 5
    } = req.query;

    let trucks;

    // If location provided, get nearby trucks
    if (lat && lng) {
      trucks = await Location.getNearbyTrucks(parseFloat(lat), parseFloat(lng), parseFloat(radius));
    } else {
      // Otherwise get all trucks with filters
      const filters = {
        cuisine_types: cuisine_types ? cuisine_types.split(',') : undefined,
        search,
        limit: limit ? parseInt(limit) : undefined
      };
      trucks = await FoodTruck.findAll(filters);
    }

    res.json({
      success: true,
      data: trucks
    });
  } catch (error) {
    console.error('Get trucks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching trucks'
    });
  }
};

const getTruckById = async (req, res) => {
  try {
    const { id } = req.params;

    const truck = await FoodTruck.findById(id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    // Get current location
    const currentLocation = await Location.getCurrentLocation(id);

    // Get menu items
    const menuItems = await MenuItem.findByTruck(id, { is_available: true });

    res.json({
      success: true,
      data: {
        ...truck,
        current_location: currentLocation,
        menu_items: menuItems
      }
    });
  } catch (error) {
    console.error('Get truck by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching truck details'
    });
  }
};

const createTruck = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      business_name,
      truck_name,
      cuisine_types,
      description,
      logo_url,
      cover_photo_url,
      contact_phone,
      social_links
    } = req.body;

    const truck = await FoodTruck.create({
      owner_id: req.user.id,
      business_name,
      truck_name,
      cuisine_types,
      description,
      logo_url,
      cover_photo_url,
      contact_phone,
      social_links
    });

    res.status(201).json({
      success: true,
      message: 'Food truck created successfully',
      data: truck
    });
  } catch (error) {
    console.error('Create truck error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating food truck'
    });
  }
};

const updateTruck = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const truck = await FoodTruck.findById(id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    // Check ownership
    if (truck.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own truck.'
      });
    }

    const {
      business_name,
      truck_name,
      cuisine_types,
      description,
      logo_url,
      cover_photo_url,
      contact_phone,
      social_links
    } = req.body;

    const updatedTruck = await FoodTruck.update(id, {
      business_name,
      truck_name,
      cuisine_types,
      description,
      logo_url,
      cover_photo_url,
      contact_phone,
      social_links
    });

    res.json({
      success: true,
      message: 'Food truck updated successfully',
      data: updatedTruck
    });
  } catch (error) {
    console.error('Update truck error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating food truck'
    });
  }
};

const deleteTruck = async (req, res) => {
  try {
    const { id } = req.params;
    const truck = await FoodTruck.findById(id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    // Check ownership
    if (truck.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own truck.'
      });
    }

    await FoodTruck.delete(id);

    res.json({
      success: true,
      message: 'Food truck deleted successfully'
    });
  } catch (error) {
    console.error('Delete truck error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting food truck'
    });
  }
};

const getMyTruck = async (req, res) => {
  try {
    const truck = await FoodTruck.findByOwner(req.user.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a registered food truck'
      });
    }

    // Get current location
    const currentLocation = await Location.getCurrentLocation(truck.id);

    // Get all locations
    const allLocations = await Location.getTruckLocations(truck.id, true);

    // Get menu items
    const menuItems = await MenuItem.findByTruck(truck.id);

    res.json({
      success: true,
      data: {
        ...truck,
        current_location: currentLocation,
        locations: allLocations,
        menu_items: menuItems
      }
    });
  } catch (error) {
    console.error('Get my truck error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your truck details'
    });
  }
};

const getTopTrucks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trucks = await FoodTruck.getTopTrucks(parseInt(limit));

    res.json({
      success: true,
      data: trucks
    });
  } catch (error) {
    console.error('Get top trucks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching top trucks'
    });
  }
};

module.exports = {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  getMyTruck,
  getTopTrucks
};