const Joi = require('joi');

// Define the validation schema
const messageTemplateSchema = Joi.object({
  id: Joi.number(),
  message: Joi.string().max(255).required(),
  messageLength: Joi.number().integer().required(),
  fontFamily: Joi.string().max(50).required(),
  isBold: Joi.boolean().required(),
  isItalic: Joi.boolean().required(),
  isUnderlined: Joi.boolean().required(),
  fontSize: Joi.string().max(10).required(),
  color: Joi.string()
    .length(7) // Assuming hex color code
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required(),
  backgroundColor: Joi.string()
    .length(7) // Assuming hex color code
    .pattern(/^#[0-9A-Fa-f]{6}$/)
    .required(),
  effect: Joi.string().max(50).required(),
  stopOver: Joi.number()
    .integer()
    .greater(0) // stopOver must be greater than 0
    .required(),
  translatedMesBefore: Joi.boolean().required(),
  translatedMessage: Joi.string().max(255).required().allow(''),
});

// Function to validate message template
exports.validateMessageTemplate = (data) => {
  return messageTemplateSchema.validate(data);
};
