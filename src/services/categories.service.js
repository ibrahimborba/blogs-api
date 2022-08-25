const { Category } = require('../database/models');

const add = async ({ name }) => {
  const alreadyExists = await Category.findOne({ where: { name } });
  if (alreadyExists) return null;

  const result = await Category.create({ name });
  return result;
};

const getAll = async () => Category.findAll();

module.exports = { add, getAll };