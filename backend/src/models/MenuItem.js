const db = require('../config/database');

class MenuItem {
  static async create(itemData) {
    const { truck_id, name, description, price, category, photo_url, is_available, is_signature, dietary_tags } = itemData;

    const query = `
      INSERT INTO menu_items (truck_id, name, description, price, category, photo_url, is_available, is_signature, dietary_tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await db.query(query, [truck_id, name, description, price, category, photo_url, is_available, is_signature, dietary_tags]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT mi.*, ft.truck_name, ft.business_name
      FROM menu_items mi
      JOIN food_trucks ft ON mi.truck_id = ft.id
      WHERE mi.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByTruck(truckId, filters = {}) {
    let query = 'SELECT * FROM menu_items WHERE truck_id = $1';
    const queryParams = [truckId];

    if (filters.category) {
      query += ` AND category = $${queryParams.length + 1}`;
      queryParams.push(filters.category);
    }

    if (filters.is_available !== undefined) {
      query += ` AND is_available = $${queryParams.length + 1}`;
      queryParams.push(filters.is_available);
    }

    if (filters.is_signature !== undefined) {
      query += ` AND is_signature = $${queryParams.length + 1}`;
      queryParams.push(filters.is_signature);
    }

    query += ' ORDER BY category, name';

    const result = await db.query(query, queryParams);
    return result.rows;
  }

  static async update(id, itemData) {
    const { name, description, price, category, photo_url, is_available, is_signature, dietary_tags } = itemData;

    const query = `
      UPDATE menu_items
      SET name = $1, description = $2, price = $3, category = $4, photo_url = $5,
          is_available = $6, is_signature = $7, dietary_tags = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const result = await db.query(query, [name, description, price, category, photo_url, is_available, is_signature, dietary_tags, id]);
    return result.rows[0];
  }

  static async updateAvailability(id, is_available) {
    const query = `
      UPDATE menu_items
      SET is_available = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await db.query(query, [is_available, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM menu_items WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  static async getCategories(truckId) {
    const query = `
      SELECT DISTINCT category
      FROM menu_items
      WHERE truck_id = $1 AND category IS NOT NULL
      ORDER BY category
    `;

    const result = await db.query(query, [truckId]);
    return result.rows.map(row => row.category);
  }

  static async search(truckId, searchTerm) {
    const query = `
      SELECT *
      FROM menu_items
      WHERE truck_id = $1
        AND (name ILIKE $2 OR description ILIKE $2)
        AND is_available = true
      ORDER BY is_signature DESC, name
    `;

    const result = await db.query(query, [truckId, `%${searchTerm}%`]);
    return result.rows;
  }
}

module.exports = MenuItem;