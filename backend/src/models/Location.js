const db = require('../config/database');

class Location {
  static async create(locationData) {
    const { truck_id, address, latitude, longitude, scheduled_start, scheduled_end, is_current, status } = locationData;

    // If setting as current, unset previous current location
    if (is_current) {
      await db.query('UPDATE locations SET is_current = false WHERE truck_id = $1', [truck_id]);
    }

    const query = `
      INSERT INTO locations (truck_id, address, latitude, longitude, scheduled_start, scheduled_end, is_current, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const result = await db.query(query, [truck_id, address, latitude, longitude, scheduled_start, scheduled_end, is_current, status]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT l.*, ft.truck_name, ft.business_name
      FROM locations l
      JOIN food_trucks ft ON l.truck_id = ft.id
      WHERE l.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getCurrentLocation(truckId) {
    const query = `
      SELECT *, ST_AsText(location_point) as location_wkt
      FROM locations
      WHERE truck_id = $1 AND is_current = true
    `;
    const result = await db.query(query, [truckId]);
    return result.rows[0];
  }

  static async getNearbyTrucks(latitude, longitude, radiusMiles = 5) {
    // Convert miles to meters (1 mile ≈ 1609.34 meters)
    const radiusMeters = radiusMiles * 1609.34;

    const query = `
      SELECT
        ft.*,
        l.id as location_id,
        l.address,
        l.latitude,
        l.longitude,
        l.status as location_status,
        l.scheduled_start,
        l.scheduled_end,
        ST_Distance(l.location_point, ST_MakePoint($2, $1)::geography) / 1609.34 as distance_miles
      FROM food_trucks ft
      JOIN locations l ON ft.id = l.truck_id
      WHERE l.is_current = true
        AND ST_DWithin(l.location_point, ST_MakePoint($2, $1)::geography, $3)
      ORDER BY distance_miles
    `;

    const result = await db.query(query, [latitude, longitude, radiusMeters]);
    return result.rows;
  }

  static async getTruckLocations(truckId, includeScheduled = false) {
    let query = `
      SELECT *, ST_AsText(location_point) as location_wkt
      FROM locations
      WHERE truck_id = $1
    `;

    if (!includeScheduled) {
      query += ' AND is_current = true';
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, [truckId]);
    return result.rows;
  }

  static async update(id, locationData) {
    const { address, latitude, longitude, scheduled_start, scheduled_end, is_current, status } = locationData;

    // If setting as current, unset previous current location for this truck
    if (is_current) {
      const truckQuery = 'SELECT truck_id FROM locations WHERE id = $1';
      const truckResult = await db.query(truckQuery, [id]);
      if (truckResult.rows[0]) {
        await db.query('UPDATE locations SET is_current = false WHERE truck_id = $1 AND id != $2', [truckResult.rows[0].truck_id, id]);
      }
    }

    const query = `
      UPDATE locations
      SET address = $1, latitude = $2, longitude = $3, scheduled_start = $4, scheduled_end = $5, is_current = $6, status = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;

    const result = await db.query(query, [address, latitude, longitude, scheduled_start, scheduled_end, is_current, status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM locations WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async getTruckActiveLocation(truckId) {
    const query = `
      SELECT *, ST_AsText(location_point) as location_wkt
      FROM locations
      WHERE truck_id = $1 AND is_current = true AND status = 'open'
    `;
    const result = await db.query(query, [truckId]);
    return result.rows[0];
  }
}

module.exports = Location;