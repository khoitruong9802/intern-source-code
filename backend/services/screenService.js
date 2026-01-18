const screenModel = require('../models/screenModel');

const screenService = {
  getAreaById: async (username, password) => {
    return screenModel.getAreaById(username, password);
  },
};

module.exports = screenService;
