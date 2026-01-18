const flightModel = require('../models/flightModel');

const flightService = {
  getUpcomingFlights: async () => {
    try {
      const data = await flightModel.getNextFlights(12);

      return data;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = flightService;
