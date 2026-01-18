const pool = require('../config/database');

const adminModel = {
  getAllAdmins: async () => {
    const result = await pool.query('SELECT * FROM admins');
    return result.rows;
  },

  getAdminById: async (id) => {
    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [id]);
    return result.rows[0];
  },

  getAdminByUserPass: async (username, password) => {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username=$1 AND password=$2',
      [username, password]
    );
    return result.rows[0];
  },

  createAdmin: async (username, password) => {
    const result = await pool.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return result.rows[0];
  },

  updateAdmin: async (id, username, password) => {
    const result = await pool.query(
      'UPDATE admins SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      [username, password, id]
    );
    return result.rows[0];
  },

  deleteAdmin: async (id) => {
    const result = await pool.query(
      'DELETE FROM admins WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = adminModel;
