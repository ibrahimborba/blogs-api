const categoriesService = require('../services/categories.service');

const add = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await categoriesService.add({ name });

    if (!result) return res.status(409).json({ message: 'Category already registered' });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { add };