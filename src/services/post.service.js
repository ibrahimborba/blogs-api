const { Op } = require('sequelize');
const { User, BlogPost, Category, PostCategory, sequelize } = require('../database/models');

const add = async ({ userId, title, content, categoryIds }) => {
  const { count, rows } = await Category.findAndCountAll({ where: { id: categoryIds } });
  if (!count) return null;

  const result = await sequelize.transaction(async (transaction) => {
    const post = await BlogPost.create({ title, content, userId }, { transaction });
    const postCategories = rows.map((category) => ({ postId: post.id, categoryId: category.id }));
    await PostCategory.bulkCreate(postCategories, { transaction });

    return post;
  });

  return result;
};

const getAll = async () => {
  const result = BlogPost.findAll({
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });

  return result;
};

const getById = async (id) => {
  const result = await BlogPost.findByPk(id, {
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });
  return result;
};

const update = async ({ userId, id, title, content }) => {
  await BlogPost.update({ title, content }, { where: { userId, id } });

  const result = await BlogPost.findOne({
    where: { userId, id },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories' },
    ],
  });
  return result;
};

const remove = async ({ userId, id }) => {
  const itExist = await BlogPost.findOne({ where: { id } });
  if (!itExist) return { notExist: !itExist };

  const result = await BlogPost.destroy({ where: { userId, id } });
  return result;
};

const search = async ({ q }) => {
  const result = BlogPost.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ],
    },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });

  return result;
};

module.exports = { add, getAll, getById, update, remove, search };