const joiHelper = require('../helpers/joi');

const postValidator = (req, res, next) => {
  const { title, content, categoryIds } = req.body;
  const post = { title, content, categoryIds };
  const { error } = joiHelper.postSchema.validate(post);

  if (error) return res.status(400).json({ message: error.message });
  next();
};

module.exports = { postValidator };