const db = require('../config/database');

class Favorite {
  static async create(favoriteData) {
    const { user_id, truck_id } = favoriteData;

    const query = `
      INSERT INTO favorites (user_id, truck_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, truck_id) DO NOTHING
      RETURNING *
    `;

    const result = await db.query(query, [user_id, truck_id]);
    return result.rows[0] || null;
  }

  static async remove(userId, truckId) {
    const query = 'DELETE FROM favorites WHERE user_id = $1 AND truck_id = $2';
    const result = await db.query(query, [userId, truckId]);
    return result.rowCount > 0;
  }

  static async findByUser(userId) {
    const query = `
      SELECT f.*, ft.truck_name, ft.business_name, ft.cuisine_types, ft.average_rating,
             ft.review_count, ft.logo_url,
             l.latitude, l.longitude, l.address, l.status as location_status
      FROM favorites f
      JOIN food_trucks ft ON f.truck_id = ft.id
      LEFT JOIN locations l ON ft.id = l.truck_id AND l.is_current = true
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async findByTruck(truckId) {
    const query = `
      SELECT f.*, u.username
      FROM favorites f
      JOIN users u ON f.user_id = u.id
      WHERE f.truck_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await db.query(query, [truckId]);
    return result.rows;
  }

  static async isFavorite(userId, truckId) {
    const query = 'SELECT * FROM favorites WHERE user_id = $1 AND truck_id = $2';
    const result = await db.query(query, [userId, truckId]);
    return result.rows.length > 0;
  }

  static async getFavoriteTrucks(userId) {
    const query = `
      SELECT DISTINCT ft.*,
             l.latitude, l.longitude, l.address, l.status as location_status,
             f.created_at as favorited_at
      FROM food_trucks ft
      JOIN favorites f ON ft.id = f.truck_id
      LEFT JOIN locations l ON ft.id = l.truck_id AND l.is_current = true
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async getFavoriteCount(truckId) {
    const query = 'SELECT COUNT(*) as count FROM favorites WHERE truck_id = $1';
    const result = await db.query(query, [truckId]);
    return parseInt(result.rows[0].count);
  }

  static async getTopTrucks(limit = 10) {
    const query = `
      SELECT ft.*, COUNT(f.id) as favorite_count
      FROM food_trucks ft
      LEFT JOIN favorites f ON ft.id = f.truck_id
      GROUP BY ft.id
      ORDER BY favorite_count DESC
      LIMIT $1
    `;

    const result = await db.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Favorite;