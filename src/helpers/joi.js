const joi = require('joi');

const userSchema = joi.object({
  email: joi.string().required().messages({
    'any.required': 'Some required fields are missing',
  }),
  password: joi.string().required().messages({
    'any.required': 'Some required fields are missing',
  }),
});

module.exports = { userSchema };