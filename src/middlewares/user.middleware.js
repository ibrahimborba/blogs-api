const joi = require('../helpers/joi');

const validator = (req, res, next) => {
  const { email, password } = req.body;
  const user = { email, password };
  const { error } = joi.userSchema.validate(user);

  if (error) return res.status(400).json({ message: 'Some required fields are missing' });

  next();
};

module.exports = { validator };