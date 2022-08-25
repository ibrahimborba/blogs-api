const joiHelper = require('../helpers/joi');

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  const user = { email, password };
  const { error } = joiHelper.loginSchema.validate(user);

  console.log(error);
  
  if (error) return res.status(400).json({ message: error.message });

  next();
};

const userValidator = (req, res, next) => {
  const { displayName, email, password, image } = req.body;
  const user = { displayName, email, password, image };
  const { error } = joiHelper.userSchema.validate(user);

  if (error) return res.status(400).json({ message: error.message });

  next();
};

module.exports = { loginValidator, userValidator };