const joiHelper = require('../helpers/joi');

const categoryValidator = (req, res, next) => {
  const { name } = req.body;
  const category = { name };
  const { error } = joiHelper.categorySchema.validate(category);

  if (error) return res.status(400).json({ message: error.message });
  next();
};

module.exports = { categoryValidator };