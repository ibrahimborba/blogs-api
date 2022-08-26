const joi = require('joi');

const REQUIRED_FIELD = 'Some required fields are missing';
const MIN_LENGTH = '{#label} length must be at least {#limit} characters long';
const NOT_FOUND = '{#label} not found';

const loginSchema = joi.object({
  email: joi.string().required().messages({
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
  password: joi.string().required().messages({
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
});

const userSchema = joi.object({
  displayName: joi.string().min(8).required().messages({
    'string.min': MIN_LENGTH,
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
  email: joi.string().email().required().messages({
    'string.email': '{#label} must be a valid email',
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
  password: joi.string().min(6).required().messages({
    'string.min': MIN_LENGTH,
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,    
  }),
  image: joi.string().required().messages({
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
});

const categorySchema = joi.object({
  name: joi.string().required().messages({
    'any.required': '{#label} is required',
    'string.empty': '{#label} is required',
  }),
});

const postSchema = joi.object({
  title: joi.string().required().messages({
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
  content: joi.string().required().messages({
    'string.email': '{#label} must be a valid email',
    'any.required': REQUIRED_FIELD,
    'string.empty': REQUIRED_FIELD,
  }),
  categoryIds: joi.array().min(1).required().messages({
    'array.min': NOT_FOUND,
    'any.required': NOT_FOUND,
    'string.empty': NOT_FOUND,    
  }),
});

module.exports = { loginSchema, userSchema, categorySchema, postSchema };