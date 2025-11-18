const { validationResult } = require('express-validator');
const Location = require('../models/Location');
const FoodTruck = require('../models/FoodTruck');

const getNearbyTrucks = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusMiles = parseFloat(radius);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }

    const trucks = await Location.getNearbyTrucks(latitude, longitude, radiusMiles);

    res.json({
      success: true,
      data: {
        trucks,
        search_center: { latitude, longitude },
        radius_miles: radiusMiles,
        count: trucks.length
      }
    });
  } catch (error) {
    console.error('Get nearby trucks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching nearby trucks'
    });
  }
};

const createLocation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    // Verify user owns a truck
    const truck = await FoodTruck.findByOwner(req.user.id);
    if (!truck) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must own a food truck to add locations.'
      });
    }

    const {
      address,
      latitude,
      longitude,
      scheduled_start,
      scheduled_end,
      is_current = false,
      status = 'open'
    } = req.body;

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }

    const location = await Location.create({
      truck_id: truck.id,
      address,
      latitude: lat,
      longitude: lng,
      scheduled_start: scheduled_start ? new Date(scheduled_start) : null,
      scheduled_end: scheduled_end ? new Date(scheduled_end) : null,
      is_current,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Location created successfully',
      data: location
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating location'
    });
  }
};

const updateLocation = async (req, res) => {
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

    // Get location and verify ownership
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const truck = await FoodTruck.findByOwner(req.user.id);
    if (!truck || truck.id !== location.truck_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own truck locations.'
      });
    }

    const {
      address,
      latitude,
      longitude,
      scheduled_start,
      scheduled_end,
      is_current,
      status
    } = req.body;

    // Validate coordinates if provided
    let lat = latitude;
    let lng = longitude;

    if (latitude !== undefined) {
      lat = parseFloat(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
          success: false,
          message: 'Invalid latitude value'
        });
      }
    }

    if (longitude !== undefined) {
      lng = parseFloat(longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        return res.status(400).json({
          success: false,
          message: 'Invalid longitude value'
        });
      }
    }

    const updatedLocation = await Location.update(id, {
      address,
      latitude: lat,
      longitude: lng,
      scheduled_start: scheduled_start ? new Date(scheduled_start) : null,
      scheduled_end: scheduled_end ? new Date(scheduled_end) : null,
      is_current,
      status
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: updatedLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating location'
    });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    // Get location and verify ownership
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const truck = await FoodTruck.findByOwner(req.user.id);
    if (!truck || truck.id !== location.truck_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own truck locations.'
      });
    }

    await Location.delete(id);

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting location'
    });
  }
};

const getTruckLocations = async (req, res) => {
  try {
    const { truck_id, include_scheduled = false } = req.query;

    if (!truck_id) {
      return res.status(400).json({
        success: false,
        message: 'Truck ID is required'
      });
    }

    const truck = await FoodTruck.findById(truck_id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    const locations = await Location.getTruckLocations(truck_id, include_scheduled === 'true');

    res.json({
      success: true,
      data: {
        truck: {
          id: truck.id,
          truck_name: truck.truck_name,
          business_name: truck.business_name
        },
        locations
      }
    });
  } catch (error) {
    console.error('Get truck locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching truck locations'
    });
  }
};

const getCurrentLocation = async (req, res) => {
  try {
    const { truck_id } = req.query;

    if (!truck_id) {
      return res.status(400).json({
        success: false,
        message: 'Truck ID is required'
      });
    }

    const truck = await FoodTruck.findById(truck_id);
    if (!truck) {
      return res.status(404).json({
        success: false,
        message: 'Food truck not found'
      });
    }

    const currentLocation = await Location.getCurrentLocation(truck_id);

    res.json({
      success: true,
      data: {
        truck: {
          id: truck.id,
          truck_name: truck.truck_name,
          business_name: truck.business_name
        },
        current_location: currentLocation
      }
    });
  } catch (error) {
    console.error('Get current location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching current location'
    });
  }
};

module.exports = {
  getNearbyTrucks,
  createLocation,
  updateLocation,
  deleteLocation,
  getTruckLocations,
  getCurrentLocation
};