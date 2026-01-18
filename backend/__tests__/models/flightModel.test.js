const pool = require('../../config/database'); // Mock this module
const flightModel = require('../../models/flightModel');

// Mock the pool.query method
jest.mock('../../config/database');

describe('flightModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFlights', () => {
    test('should return all flights', async () => {
      const mockFlights = [{ id: 1, flight_number: 'AA123' }];
      pool.query.mockResolvedValueOnce({ rows: mockFlights });

      const result = await flightModel.getAllFlights();

      expect(result).toEqual(mockFlights);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM flights');
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.getAllFlights()).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getFlightById', () => {
    test('should return a flight by ID', async () => {
      const mockFlight = { id: 1, flight_number: 'AA123' };
      pool.query.mockResolvedValueOnce({ rows: [mockFlight] });

      const result = await flightModel.getFlightById(1);

      expect(result).toEqual(mockFlight);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM flights WHERE id = $1',
        [1]
      );
    });

    test('should return undefined if flight not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await flightModel.getFlightById(999); // Non-existing ID

      expect(result).toBeUndefined();
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.getFlightById(1)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getFlights', () => {
    test('should return paginated flights', async () => {
      const mockFlights = [{ id: 1, flight_number: 'AA123' }];
      pool.query.mockResolvedValueOnce({ rows: mockFlights });

      const result = await flightModel.getFlights(1, 10);

      expect(result).toEqual(mockFlights);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [10, 0] // limit and offset
      );
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.getFlights(1, 10)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getNextFlights', () => {
    test('should return next flights', async () => {
      const mockFlights = [{ id: 1, flight_number: 'AA123' }];
      pool.query.mockResolvedValueOnce({ rows: mockFlights });

      const result = await flightModel.getNextFlights(5);

      expect(result).toEqual(mockFlights);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [5] // limit
      );
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.getNextFlights(5)).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('getFlightsCount', () => {
    test('should return the total count of flights', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ count: '10' }] });

      const result = await flightModel.getFlightsCount();

      expect(result).toBe(10);
      expect(pool.query).toHaveBeenCalledWith('SELECT COUNT(*) FROM flights');
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.getFlightsCount()).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('createFlight', () => {
    test('should create a new flight', async () => {
      const mockFlight = { id: 1, flight_number: 'AA123' };
      pool.query.mockResolvedValueOnce({ rows: [mockFlight] });

      const result = await flightModel.createFlight(
        'AA123',
        1,
        1,
        new Date(),
        new Date(),
        'A1',
        'On time'
      );

      expect(result).toEqual(mockFlight);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO public.flights'),
        ['AA123', 1, 1, expect.any(Date), expect.any(Date), 'A1', 'On time']
      );
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        flightModel.createFlight(
          'AA123',
          1,
          1,
          new Date(),
          new Date(),
          'A1',
          'On time'
        )
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateFlight', () => {
    test('should update an existing flight', async () => {
      const mockFlight = { id: 1, flight_number: 'AA123' };
      pool.query.mockResolvedValueOnce({ rows: [mockFlight] });

      const result = await flightModel.updateFlight(
        1,
        'AA123',
        1,
        1,
        new Date(),
        new Date(),
        'A1',
        'On time'
      );

      expect(result).toEqual(mockFlight);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE flights'),
        ['AA123', 1, 1, expect.any(Date), expect.any(Date), 'A1', 'On time', 1]
      );
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        flightModel.updateFlight(
          1,
          'AA123',
          1,
          1,
          new Date(),
          new Date(),
          'A1',
          'On time'
        )
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteFlight', () => {
    test('should delete a flight', async () => {
      const mockFlight = { id: 1, flight_number: 'AA123' };
      pool.query.mockResolvedValueOnce({ rows: [mockFlight] });

      const result = await flightModel.deleteFlight(1);

      expect(result).toEqual(mockFlight);
      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM flights WHERE id = $1 RETURNING *',
        [1]
      );
    });

    test('should handle errors', async () => {
      pool.query.mockRejectedValueOnce(new Error('Database error'));

      await expect(flightModel.deleteFlight(1)).rejects.toThrow(
        'Database error'
      );
    });
  });
});
