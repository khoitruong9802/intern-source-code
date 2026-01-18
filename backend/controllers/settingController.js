const settingModel = require('../models/settingModel');
const { snakeToCamel } = require('../utils/helpers');
const socket = require('../config/socket'); // Import the WebSocket setup function
const { validateSettings } = require('../validations/settingValidator');

const settingController = {
  getSettings: async (req, res) => {
    try {
      const setting = await settingModel.getSettings();
      res.json(snakeToCamel(setting));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateSetting: async (req, res) => {
    const { error } = validateSettings(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { screenInterval } = req.body;
    try {
      const updatedSetting = await settingModel.updateSetting(
        req.params.id,
        screenInterval
      );
      if (!updatedSetting) {
        return res.status(404).json({ message: 'Setting not found' });
      }
      socket.changeInterval(screenInterval);
      res.json(snakeToCamel(updatedSetting));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteSetting: async (req, res) => {
    try {
      const deletedSetting = await settingModel.deleteSetting(req.params.id);
      if (!deletedSetting) {
        return res.status(404).json({ message: 'Setting not found' });
      }
      res.json(deletedSetting);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = settingController;
