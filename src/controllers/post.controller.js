const postService = require('../services/post.service');

const add = async (req, res, next) => {
  const { userId } = req;
  const { title, content, categoryIds } = req.body;
  try { 
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

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await postService.getById(id);
    if (!result) return res.status(404).json({ message: 'Post does not exist' });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { userId } = req;
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await postService.update({ userId, id, title, content });
    if (!result) return res.status(401).json({ message: 'Unauthorized user' });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, getAll, getById, update };