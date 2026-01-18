const flightModel = require('../models/flightModel');
const { snakeToCamel } = require('../utils/helpers');
const { validateFlight } = require('../validations/flightValidator');

const flightController = {
  getFlights: async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page and limit

    try {
      const data = await flightModel.getFlights(page, limit);
      const totalCount = await flightModel.getFlightsCount();
      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        page: parseInt(page, 10),
        totalPages,
        totalCount,
        data: data.map((item) => snakeToCamel(item)),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFlightById: async (req, res) => {
    try {
      const flight = await flightModel.getFlightById(req.params.id);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
      res.json(snakeToCamel(flight));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createFlight: async (req, res) => {
    const { error } = validateFlight(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const {
      flightNumber,
      arrivalAirportId,
      airlineId,
      departureTime,
      arrivalTime,
      gate,
      remark,
    } = req.body;
    try {
      const newFlight = await flightModel.createFlight(
        flightNumber,
        arrivalAirportId,
        airlineId,
        departureTime,
        arrivalTime,
        gate,
        remark
      );
      res.status(201).json(snakeToCamel(newFlight));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateFlight: async (req, res) => {
    const { error } = validateFlight(req.body);

    // Check if validation failed
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const {
      flightNumber,
      arrivalAirportId,
      airlineId,
      departureTime,
      arrivalTime,
      gate,
      remark,
    } = req.body;
    try {
      const updatedFlight = await flightModel.updateFlight(
        req.params.id,
        flightNumber,
        arrivalAirportId,
        airlineId,
        departureTime,
        arrivalTime,
        gate,
        remark
      );
      if (!updatedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
      res.json(snakeToCamel(updatedFlight));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteFlight: async (req, res) => {
    try {
      const deletedFlight = await flightModel.deleteFlight(req.params.id);
      if (!deletedFlight) {
        return res.status(404).json({ message: 'Flight not found' });
      }
      res.json(snakeToCamel(deletedFlight));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = flightController;
