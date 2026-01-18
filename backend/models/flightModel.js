const pool = require('../config/database');

const flightModel = {
  getAllFlights: async () => {
    const result = await pool.query('SELECT * FROM flights');
    return result.rows;
  },

  getFlightById: async (id) => {
    const result = await pool.query('SELECT * FROM flights WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  },

  // Function to get paginated flights
  getFlights: async (page, limit) => {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `
      SELECT 
        f.id,
        f.airline_id,
        f.arrival_airport_id,
        f.flight_number,
        a1.name AS departure_airport,
        a2.name AS arrival_airport,
        al.name AS airline,
        f.departure_time,
        f.arrival_time,
        f.gate,
        f.remark
      FROM flights f
      JOIN airports a1 ON f.departure_airport_id = a1.id
      JOIN airports a2 ON f.arrival_airport_id = a2.id
      JOIN airlines al ON f.airline_id = al.id
      ORDER BY id DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return result.rows;
  },

  getNextFlights: async (limit) => {
    const result = await pool.query(
      `
      SELECT 
        f.id,
        f.airline_id,
        f.arrival_airport_id,
        f.flight_number,
        a1.name AS departure_airport,
        a2.name AS arrival_airport,
        al.name AS airline,
        f.departure_time,
        f.arrival_time,
        f.gate,
        f.remark
      FROM flights f
      JOIN airports a1 ON f.departure_airport_id = a1.id
      JOIN airports a2 ON f.arrival_airport_id = a2.id
      JOIN airlines al ON f.airline_id = al.id
      WHERE departure_time >= NOW()
		  ORDER BY departure_time
		  LIMIT $1;`,
      [limit]
    );

    return result.rows;
  },

  // Function to get total count of flights
  getFlightsCount: async () => {
    const countResult = await pool.query('SELECT COUNT(*) FROM flights');
    return parseInt(countResult.rows[0].count, 10);
  },

  createFlight: async (
    flightNumber,
    arrivalAirportId,
    airlineId,
    departureTime,
    arrivalTime,
    gate,
    remark
  ) => {
    const result = await pool.query(
      `
      INSERT INTO public.flights(
        flight_number,
        arrival_airport_id,
        airline_id,
        departure_time,
        arrival_time,
        gate,
        remark
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        flightNumber,
        arrivalAirportId,
        airlineId,
        departureTime,
        arrivalTime,
        gate,
        remark,
      ]
    );
    return result.rows[0];
  },

  updateFlight: async (
    id,
    flightNumber,
    arrivalAirportId,
    airlineId,
    departureTime,
    arrivalTime,
    gate,
    remark
  ) => {
    const result = await pool.query(
      `
      UPDATE flights 
      SET 
        flight_number = $1,
        arrival_airport_id = $2,
        airline_id = $3,
        departure_time = $4,
        arrival_time = $5,
        gate = $6,
        remark = $7
      WHERE id = $8 RETURNING *`,
      [
        flightNumber,
        arrivalAirportId,
        airlineId,
        departureTime,
        arrivalTime,
        gate,
        remark,
        id,
      ]
    );
    return result.rows[0];
  },

  deleteFlight: async (id) => {
    const result = await pool.query(
      'DELETE FROM flights WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = flightModel;
