const postService = require('../services/post.service');

const add = async (req, res, next) => {
  const { userId } = req;
  try { 
    const { title, content, categoryIds } = req.body;
    const result = await postService.add({ userId, title, content, categoryIds });
    if (!result) return res.status(400).json({ message: '"categoryIds" not found' });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const result = await postService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, getAll };