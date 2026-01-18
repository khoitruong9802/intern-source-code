const Joi = require('joi');

// Define the validation schema
const settingsSchema = Joi.object({
  id: Joi.number(),
  screenInterval: Joi.number()
    .integer() // Must be an integer
    .min(1) // Must be greater than 0
    .max(20000) // Must be less than or equal to 20000
    .required() // Required field
    .messages({
      'number.base': 'Screen interval must be a number.',
      'number.integer': 'Screen interval must be an integer.',
      'number.min': 'Screen interval must be greater than 0.',
      'number.max': 'Screen interval must be less than or equal to 20000.',
      'any.required': 'Screen interval is required.',
    }),
});

// Function to validate settings data
exports.validateSettings = (data) => {
  return settingsSchema.validate(data);
};
