const Sequelize = require('sequelize');
const config = require('../database/config/config');
const { User, BlogPost, Category, PostCategory } = require('../database/models');

const sequelize = new Sequelize(config.development);

const add = async ({ userId, title, content, categoryIds }) => {
  const { count, rows } = await Category.findAndCountAll({ where: { id: categoryIds } });
  if (!count) return null;

  const result = await sequelize.transaction(async (t) => {
    const post = await BlogPost.create({ title, content, userId }, { transaction: t });
    const postCategories = rows.map((category) => ({ postId: post.id, categoryId: category.id }));
    await PostCategory.bulkCreate(postCategories, { transaction: t });

    return post;
  });

  return result;
};

const getAll = async () => {
  const result = BlogPost.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });

  return result;
};

const getById = async (id) => {
  const result = await BlogPost.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      {
        model: Category,
        as: 'categories',
      },
    ],
  });
  return result;
};

module.exports = { add, getAll, getById };