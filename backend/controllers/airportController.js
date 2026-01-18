const airportModel = require('../models/airportModel');

const airportController = {
  getAllAirports: async (req, res) => {
    try {
      const airport = await airportModel.getAllAirports();
      res.json(airport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getAirports: async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page and limit

    try {
      const data = await airportModel.getAirports(page, limit);
      const totalCount = await airportModel.getAirportsCount();
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

  getAirportById: async (req, res) => {
    try {
      const airport = await airportModel.getAirportById(req.params.id);
      if (!airport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.json(airport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createAirport: async (req, res) => {
    const { name, code, city, country } = req.body;
    try {
      const newAirport = await airportModel.createAirport(
        name,
        code,
        city,
        country
      );
      res.status(201).json(newAirport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateAirport: async (req, res) => {
    const { name, code, city, country } = req.body;
    try {
      const updatedAirport = await airportModel.updateAirport(
        req.params.id,
        name,
        code,
        city,
        country
      );
      if (!updatedAirport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.json(updatedAirport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteAirport: async (req, res) => {
    try {
      const deletedAirport = await airportModel.deleteAirport(req.params.id);
      if (!deletedAirport) {
        return res.status(404).json({ message: 'Airport not found' });
      }
      res.json(deletedAirport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = airportController;
