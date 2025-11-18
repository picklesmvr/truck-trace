const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password, profile_photo_url, preferred_cuisines, notification_radius_miles } = userData;

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, email, password_hash, profile_photo_url, preferred_cuisines, notification_radius_miles)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, profile_photo_url, preferred_cuisines, notification_radius_miles, push_notifications_enabled, created_at
    `;

    const result = await db.query(query, [username, email, password_hash, profile_photo_url, preferred_cuisines, notification_radius_miles]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, username, email, profile_photo_url, preferred_cuisines, notification_radius_miles, push_notifications_enabled, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async update(id, userData) {
    const { username, profile_photo_url, preferred_cuisines, notification_radius_miles, push_notifications_enabled } = userData;

    const query = `
      UPDATE users
      SET username = $1, profile_photo_url = $2, preferred_cuisines = $3, notification_radius_miles = $4, push_notifications_enabled = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, username, email, profile_photo_url, preferred_cuisines, notification_radius_miles, push_notifications_enabled, updated_at
    `;

    const result = await db.query(query, [username, profile_photo_url, preferred_cuisines, notification_radius_miles, push_notifications_enabled, id]);
    return result.rows[0];
  }

  static async getFoodTruck(userId) {
    const query = `
      SELECT * FROM food_trucks
      WHERE owner_id = $1
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;