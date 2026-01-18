const Joi = require('joi');

// Define the validation schema
const screenSchema = Joi.object({
  id: Joi.number(),
  name: Joi.string()
    .max(20) // Maximum length of 20 characters
    .required(), // Name is required
  area: Joi.string()
    .valid('departure', 'arrival') // Must be either 'departure' or 'arrival'
    .required(), // Area is required
  gate: Joi.string()
    .max(5) // Maximum length of 5 characters
    .required(), // Gate is required
});

// Function to validate screen data
exports.validateScreen = (data) => {
  return screenSchema.validate(data);
};
