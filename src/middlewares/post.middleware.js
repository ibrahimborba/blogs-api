const joiHelper = require('../helpers/joi');

const postValidator = (req, res, next) => {
  const { title, content, categoryIds } = req.body;
  const post = { title, content, categoryIds };
  const { error } = joiHelper.postSchema.validate(post);

  if (error) return res.status(400).json({ message: error.message });
  next();
};

const updateValidator = (req, res, next) => {
  const { title, content } = req.body;
  const post = { title, content };
  const { error } = joiHelper.updatePostSchema.validate(post);

  if (error) return res.status(400).json({ message: error.message });
  next();
};

module.exports = { postValidator, updateValidator };