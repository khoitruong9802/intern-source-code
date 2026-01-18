const pool = require('../config/database');

const settingModel = {
  // Function to get paginated flights
  getSettings: async () => {
    const result = await pool.query('SELECT * FROM settings');

    return result.rows[0];
  },

  updateSetting: async (id, screenInterval) => {
    const result = await pool.query(
      'UPDATE settings SET screen_interval = $1 WHERE id = $2 RETURNING *',
      [screenInterval, id]
    );
    return result.rows[0];
  },

  deleteSetting: async (id) => {
    const result = await pool.query(
      'DELETE FROM settings WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = settingModel;
