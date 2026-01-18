const settingModel = require('../models/settingModel');

const settingService = {
  getInterval: async () => {
    const data = await settingModel.getSettings();
    return data.screen_interval;
  },
};

module.exports = settingService;
