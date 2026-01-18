const { validateFlight } = require('../../validations/flightValidator');

describe('Flight Validation', () => {
  test('should validate valid flight data', () => {
    const validData = {
      flightNumber: 'AA123',
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A1',
      remark: '',
    };

    const { error } = validateFlight(validData);
    expect(error).toBeUndefined(); // Should not have any error
  });

  test('should fail when flightNumber is missing', () => {
    const invalidData = {
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A1',
      remark: '',
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe('"flightNumber" is required');
  });

  test('should fail when arrivalTime is before departureTime', () => {
    const invalidData = {
      flightNumber: 'AA123',
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T14:00:00Z'),
      arrivalTime: new Date('2024-01-01T12:00:00Z'), // Invalid
      gate: 'A1',
      remark: '',
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      'Arrival time must be after departure time.'
    );
  });

  test('should fail when gate is too long', () => {
    const invalidData = {
      flightNumber: 'AA123',
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A12345', // Invalid
      remark: '',
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"gate" length must be less than or equal to 5 characters long'
    );
  });

  test('should fail when remark is too long', () => {
    const invalidData = {
      flightNumber: 'AA123',
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A1',
      remark: 'a'.repeat(256), // Invalid
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"remark" length must be less than or equal to 255 characters long'
    );
  });

  test('should fail when flightNumber is a number', () => {
    const invalidData = {
      flightNumber: 12345, // Invalid type
      departureAirportId: 1,
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A1',
      remark: '',
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe('"flightNumber" must be a string');
  });

  test('should fail when departureAirportId is not an integer', () => {
    const invalidData = {
      flightNumber: 'AA123',
      departureAirportId: 'not-an-integer', // Invalid type
      arrivalAirportId: 2,
      airlineId: 3,
      departureTime: new Date('2024-01-01T12:00:00Z'),
      arrivalTime: new Date('2024-01-01T14:00:00Z'),
      gate: 'A1',
      remark: '',
    };

    const { error } = validateFlight(invalidData);
    expect(error).toBeDefined(); // Should have an error
    expect(error.details[0].message).toBe(
      '"departureAirportId" must be a number'
    );
  });
});
