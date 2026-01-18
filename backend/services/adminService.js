const adminModel = require('../models/adminModel');

const adminService = {
  checkAdmin: async (username, password) => {
    return adminModel.getAdminByUserPass(username, password);
  },
};

module.exports = adminService;
