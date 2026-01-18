const screenModel = require('../models/screenModel');
const socket = require('../config/socket');
const { validateScreen } = require('../validations/screenValidator');

const screenController = {
  getAllScreens: async (req, res) => {
    try {
      const screen = await screenModel.getAllScreens();
      res.json(screen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getScreens: async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page and limit

    try {
      const data = await screenModel.getScreens(page, limit);
      const totalCount = await screenModel.getScreensCount();
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        page: parseInt(page, 10),
        totalPages,
        totalCount,
        data,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  },

  createScreen: async (req, res) => {
    const { error } = validateScreen(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { name, area, gate } = req.body;
    try {
      const newScreen = await screenModel.createScreen(name, area, gate);
      res.status(201).json(newScreen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateScreen: async (req, res) => {
    const { error } = validateScreen(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const { name, area, gate } = req.body;
    try {
      const updatedScreen = await screenModel.updateScreen(
        req.params.id,
        name,
        area,
        gate
      );
      if (!updatedScreen) {
        return res.status(404).json({ message: 'Screen not found' });
      }
      res.json(updatedScreen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteScreen: async (req, res) => {
    try {
      const deletedScreen = await screenModel.deleteScreen(req.params.id);
      if (!deletedScreen) {
        return res.status(404).json({ message: 'Screen not found' });
      }
      res.json(deletedScreen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  controlScreen: async (req, res) => {
    const { screen, status } = req.body;
    try {
      const isSuccessful = await socket.sendMessage(screen, 'on-off', status);
      if (isSuccessful) {
        socket.setScreenStatus(screen, status);
      }
      res.status(200).json({
        message: isSuccessful
          ? status
            ? 'Turn on successfully'
            : 'Turn off successfully'
          : 'Operation failed',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = screenController;
