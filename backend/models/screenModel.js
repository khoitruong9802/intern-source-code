const pool = require('../config/database');

const screenModel = {
  getAllScreens: async () => {
    const result = await pool.query('SELECT * FROM screens');
    return result.rows;
  },

  // Function to get paginated flights
  getScreens: async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      'SELECT * FROM screens ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return result.rows;
  },

  getAreaById: async (id) => {
    const result = await pool.query('SELECT area FROM screens WHERE id = $1', [
      id,
    ]);

    return result.rows[0];
  },

  // Function to get total count of flights
  getScreensCount: async () => {
    const countResult = await pool.query('SELECT COUNT(*) FROM screens');
    return parseInt(countResult.rows[0].count, 10);
  },

  createScreen: async (name, area, gate) => {
    const result = await pool.query(
      'INSERT INTO screens (name, area, gate) VALUES ($1, $2, $3) RETURNING *',
      [name, area, gate]
    );
    return result.rows[0];
  },

  updateScreen: async (id, name, area, gate) => {
    const result = await pool.query(
      'UPDATE screens SET name = $1, area = $2, gate = $3 WHERE id = $4 RETURNING *',
      [name, area, gate, id]
    );
    return result.rows[0];
  },

  deleteScreen: async (id) => {
    const result = await pool.query(
      'DELETE FROM screens WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = screenModel;
