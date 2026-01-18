const flightModel = require('../../models/flightModel');
const { snakeToCamel } = require('../../utils/helpers');
const { validateFlight } = require('../../validations/flightValidator');
const flightController = require('../../controllers/flightController');

jest.mock('../../models/flightModel');
jest.mock('../../utils/helpers');
jest.mock('../../validations/flightValidator');

describe('flightController', () => {
  const mockRes = () => {
    const res = {};
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockReq = (overrides) => ({
    params: {},
    query: {},
    body: {},
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlights', () => {
    test('should return flight data with pagination', async () => {
      const req = mockReq({ query: { page: 1, limit: 10 } });
      const res = mockRes();
      const mockData = [{ flight_number: 'AA123', airline_id: 1 }];
      flightModel.getFlights.mockResolvedValue(mockData);
      flightModel.getFlightsCount.mockResolvedValue(20);
      snakeToCamel.mockImplementation((data) => data);

      await flightController.getFlights(req, res);

      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        totalPages: 2,
        totalCount: 20,
        data: mockData,
      });
    });

    test('should handle errors', async () => {
      const req = mockReq();
      const res = mockRes();
      flightModel.getFlights.mockRejectedValue(new Error('Database error'));

      await flightController.getFlights(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('getFlightById', () => {
    test('should return flight by ID', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      const mockFlight = { flight_number: 'AA123', airline_id: 1 };
      flightModel.getFlightById.mockResolvedValue(mockFlight);
      snakeToCamel.mockImplementation((data) => data);

      await flightController.getFlightById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFlight);
    });

    test('should return 404 if flight not found', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      flightModel.getFlightById.mockResolvedValue(null);

      await flightController.getFlightById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Flight not found' });
    });

    test('should handle errors', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      flightModel.getFlightById.mockRejectedValue(new Error('Database error'));

      await flightController.getFlightById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('createFlight', () => {
    test('should create a new flight', async () => {
      const req = mockReq({
        body: {
          flightNumber: 'AA123',
          arrivalAirportId: 1,
          airlineId: 1,
          departureTime: Date.now(),
          arrivalTime: Date.now(),
          gate: 'A1',
          remark: 'On time',
        },
      });
      const res = mockRes();
      flightModel.createFlight.mockResolvedValue(req.body);
      snakeToCamel.mockImplementation((data) => data);
      validateFlight.mockReturnValue({ error: null });

      await flightController.createFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    test('should return 400 if validation fails', async () => {
      const req = mockReq({ body: {} });
      const res = mockRes();
      validateFlight.mockReturnValue({
        error: { message: 'Validation error' },
      });

      await flightController.createFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });

    test('should handle errors', async () => {
      const req = mockReq({ body: { flightNumber: 'AA123' } });
      const res = mockRes();
      validateFlight.mockReturnValue({ error: null });
      flightModel.createFlight.mockRejectedValue(new Error('Database error'));

      await flightController.createFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('updateFlight', () => {
    test('should update an existing flight', async () => {
      const req = mockReq({
        params: { id: '1' },
        body: { flightNumber: 'AA123', airlineId: 1 },
      });
      const res = mockRes();
      flightModel.updateFlight.mockResolvedValue(req.body);
      snakeToCamel.mockImplementation((data) => data);
      validateFlight.mockReturnValue({ error: null });

      await flightController.updateFlight(req, res);

      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    test('should return 404 if flight not found', async () => {
      const req = mockReq({
        params: { id: '1' },
        body: { flightNumber: 'AA123' },
      });
      const res = mockRes();
      flightModel.updateFlight.mockResolvedValue(null);
      validateFlight.mockReturnValue({ error: null });

      await flightController.updateFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Flight not found' });
    });

    test('should return 400 if validation fails', async () => {
      const req = mockReq({ body: {} });
      const res = mockRes();
      validateFlight.mockReturnValue({
        error: { message: 'Validation error' },
      });

      await flightController.updateFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });

    test('should handle errors', async () => {
      const req = mockReq({
        params: { id: '1' },
        body: { flightNumber: 'AA123' },
      });
      const res = mockRes();
      validateFlight.mockReturnValue({ error: null });
      flightModel.updateFlight.mockRejectedValue(new Error('Database error'));

      await flightController.updateFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  describe('deleteFlight', () => {
    test('should delete a flight', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      const mockFlight = { flight_number: 'AA123' };
      flightModel.deleteFlight.mockResolvedValue(mockFlight);
      snakeToCamel.mockImplementation((data) => data);

      await flightController.deleteFlight(req, res);

      expect(res.json).toHaveBeenCalledWith(mockFlight);
    });

    test('should return 404 if flight not found', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      flightModel.deleteFlight.mockResolvedValue(null);

      await flightController.deleteFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Flight not found' });
    });

    test('should handle errors', async () => {
      const req = mockReq({ params: { id: '1' } });
      const res = mockRes();
      flightModel.deleteFlight.mockRejectedValue(new Error('Database error'));

      await flightController.deleteFlight(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
