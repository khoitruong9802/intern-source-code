const flightModel = require('../../models/flightModel');
const flightService = require('../../services/flightService');

// Mock the flightModel
jest.mock('../../models/flightModel');

describe('flightService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUpcomingFlights', () => {
    test('should return upcoming flights data', async () => {
      const mockUpcomingFlights = [
        { id: 1, flight_number: 'AA123', departure_time: new Date() },
      ];
      flightModel.getNextFlights.mockResolvedValueOnce(mockUpcomingFlights);

      const result = await flightService.getUpcomingFlights();

      expect(result).toEqual(mockUpcomingFlights);
      expect(flightModel.getNextFlights).toHaveBeenCalledWith(12);
    });

    test('should handle errors', async () => {
      flightModel.getNextFlights.mockRejectedValueOnce(
        new Error('Database error')
      );

      const result = await flightService.getUpcomingFlights();

      expect(result).toBeUndefined(); // Since there's no explicit return on error
      expect(flightModel.getNextFlights).toHaveBeenCalledWith(12);
    });
  });
});
