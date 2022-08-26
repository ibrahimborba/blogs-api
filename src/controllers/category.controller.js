const categoryService = require('../services/category.service');

const add = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await categoryService.add({ name });

    if (!result) return res.status(409).json({ message: 'Category already registered' });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await categoryService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { add, getAll };