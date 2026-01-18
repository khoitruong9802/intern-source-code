const Joi = require('joi');

exports.validateAdmin = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(254).required(),
    password: Joi.string().min(6).max(254).required(),
  });
  return schema.validate(data);
};
