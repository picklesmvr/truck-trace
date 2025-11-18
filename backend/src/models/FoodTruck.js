const db = require('../config/database');

class FoodTruck {
  static async create(truckData) {
    const { owner_id, business_name, truck_name, cuisine_types, description, logo_url, cover_photo_url, contact_phone, social_links } = truckData;

    const query = `
      INSERT INTO food_trucks (owner_id, business_name, truck_name, cuisine_types, description, logo_url, cover_photo_url, contact_phone, social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await db.query(query, [owner_id, business_name, truck_name, cuisine_types, description, logo_url, cover_photo_url, contact_phone, social_links]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT ft.*, u.username as owner_username, u.email as owner_email
      FROM food_trucks ft
      JOIN users u ON ft.owner_id = u.id
      WHERE ft.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByOwner(owner_id) {
    const query = 'SELECT * FROM food_trucks WHERE owner_id = $1';
    const result = await db.query(query, [owner_id]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT ft.*, u.username as owner_username,
             l.latitude, l.longitude, l.address, l.status as location_status, l.is_current
      FROM food_trucks ft
      JOIN users u ON ft.owner_id = u.id
      LEFT JOIN locations l ON ft.id = l.truck_id AND l.is_current = true
    `;

    const queryParams = [];
    const whereClauses = [];

    if (filters.cuisine_types && filters.cuisine_types.length > 0) {
      whereClauses.push(`ft.cuisine_types && $${queryParams.length + 1}`);
      queryParams.push(filters.cuisine_types);
    }

    if (filters.search) {
      whereClauses.push(`(ft.trunk_name ILIKE $${queryParams.length + 1} OR ft.business_name ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${filters.search}%`);
    }

    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += ' ORDER BY ft.average_rating DESC, ft.review_count DESC';

    if (filters.limit) {
      query += ` LIMIT $${queryParams.length + 1}`;
      queryParams.push(filters.limit);
    }

    const result = await db.query(query, queryParams);
    return result.rows;
  }

  static async update(id, truckData) {
    const { business_name, truck_name, cuisine_types, description, logo_url, cover_photo_url, contact_phone, social_links } = truckData;

    const query = `
      UPDATE food_trucks
      SET business_name = $1, truck_name = $2, cuisine_types = $3, description = $4,
          logo_url = $5, cover_photo_url = $6, contact_phone = $7, social_links = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const result = await db.query(query, [business_name, truck_name, cuisine_types, description, logo_url, cover_photo_url, contact_phone, social_links, id]);
    return result.rows[0];
  }

  static async updateRating(id, newRating) {
    const query = `
      UPDATE food_trucks
      SET average_rating = $1, review_count = review_count + 1, updated_at = NOW()
      WHERE id = $2
      RETURNING average_rating, review_count
    `;

    const result = await db.query(query, [newRating, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM food_trucks WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = FoodTruck;