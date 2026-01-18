const pool = require('../config/database');

const airlineModel = {
  getAllAirlines: async () => {
    const result = await pool.query(
      'SELECT id, name, code, country FROM airlines'
    );
    return result.rows;
  },

  getAllAirlinesImg: async () => {
    const result = await pool.query('SELECT * FROM airlines');
    return result.rows;
  },

  getAirlineById: async (id) => {
    const result = await pool.query('SELECT * FROM airlines WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  },

  // Function to get paginated airlines
  getAirlines: async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM airlines ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  // Function to get total count of airlines
  getAirlinesCount: async () => {
    const countResult = await pool.query('SELECT COUNT(*) FROM airlines');
    return parseInt(countResult.rows[0].count, 10);
  },

  createAirline: async (name, code, country) => {
    const result = await pool.query(
      'INSERT INTO airlines (name, code, country) VALUES ($1, $2, $3) RETURNING *',
      [name, code, country]
    );
    return result.rows[0];
  },

  updateAirline: async (id, name, code, country) => {
    const result = await pool.query(
      'UPDATE airlines SET name = $1, code = $2, country = $3 WHERE id = $4 RETURNING *',
      [name, code, country, id]
    );
    return result.rows[0];
  },

  deleteAirline: async (id) => {
    const result = await pool.query(
      'DELETE FROM airlines WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = airlineModel;
