const pool = require('../config/database');

const airportModel = {
  getAllAirports: async () => {
    const result = await pool.query('SELECT * FROM airports');
    return result.rows;
  },

  getAirportById: async (id) => {
    const result = await pool.query('SELECT * FROM airports WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  },

  // Function to get paginated airports
  getAirports: async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM airports ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  // Function to get total count of airports
  getAirportsCount: async () => {
    const countResult = await pool.query('SELECT COUNT(*) FROM airports');
    return parseInt(countResult.rows[0].count, 10);
  },

  createAirport: async (name, code, city, country) => {
    const result = await pool.query(
      'INSERT INTO airports (name, code, city, country) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, city, country]
    );
    return result.rows[0];
  },

  updateAirport: async (id, name, code, city, country) => {
    const result = await pool.query(
      'UPDATE airports SET name = $1, code = $2, city = $3, country = $4 WHERE id = $5 RETURNING *',
      [name, code, city, country, id]
    );
    return result.rows[0];
  },

  deleteAirport: async (id) => {
    const result = await pool.query(
      'DELETE FROM airports WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = airportModel;
