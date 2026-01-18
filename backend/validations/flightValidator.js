const Joi = require('joi');

// Define the validation schema
const flightSchema = Joi.object({
  id: Joi.number(),
  flightNumber: Joi.string()
    .max(20) // Maximum length of 20 characters
    .required(), // Flight number is required and cannot be empty
  departureAirportId: Joi.number().integer(), // Departure airport ID is required
  arrivalAirportId: Joi.number().integer().required(), // Arrival airport ID is required
  airlineId: Joi.number().integer().required(), // Airline ID is required
  departureTime: Joi.date().required(), // Departure time is required
  arrivalTime: Joi.date()
    .greater(Joi.ref('departureTime')) // Arrival time must be after departure time
    .required() // Arrival time is required
    .messages({ 'date.greater': 'Arrival time must be after departure time.' }),
  gate: Joi.string()
    .max(5) // Maximum length of 5 characters
    .required(), // Gate is required and cannot be empty
  remark: Joi.string()
    .max(255) // Maximum length of 255 characters
    .allow(''), // Allow empty remark
});

// Function to validate flight data
exports.validateFlight = (data) => {
  return flightSchema.validate(data);
};
