const airlineModel = require('../models/airlineModel');

const airlineController = {
  getAllAirlines: async (req, res) => {
    try {
      const { img } = req.query;
      let airlines;
      if (img === undefined) {
        airlines = await airlineModel.getAllAirlines();
      } else {
        airlines = await airlineModel.getAllAirlinesImg();
      }
      res.json(airlines);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAirlines: async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page and limit

    try {
      const data = await airlineModel.getAirlines(page, limit);
      const totalCount = await airlineModel.getAirlinesCount();
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

  getAirlineById: async (req, res) => {
    try {
      const airline = await airlineModel.getAirlineById(req.params.id);
      if (!airline) {
        return res.status(404).json({ message: 'Airline not found' });
      }
      res.json(airline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createAirline: async (req, res) => {
    const { name, code, country } = req.body;
    try {
      const newAirline = await airlineModel.createAirline(name, code, country);
      res.status(201).json(newAirline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateAirline: async (req, res) => {
    const { name, code, country } = req.body;
    try {
      const updatedAirline = await airlineModel.updateAirline(
        req.params.id,
        name,
        code,
        country
      );
      if (!updatedAirline) {
        return res.status(404).json({ message: 'Airline not found' });
      }
      res.json(updatedAirline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteAirline: async (req, res) => {
    try {
      const deletedAirline = await airlineModel.deleteAirline(req.params.id);
      if (!deletedAirline) {
        return res.status(404).json({ message: 'Airline not found' });
      }
      res.json(deletedAirline);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = airlineController;
