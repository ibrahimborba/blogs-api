const Sequelize = require('sequelize');
const config = require('../database/config/config');
const { BlogPost, Category, PostCategory } = require('../database/models');

const sequelize = new Sequelize(config.development);

const add = async ({ userId, title, content, categoryIds }) => {
  try {
    const { count, rows } = await Category.findAndCountAll({ where: { id: categoryIds } });
    if (!count) return null;

    const result = await sequelize.transaction(async (t) => {
      const post = await BlogPost.create({ title, content, userId }, { transaction: t });
      const postCategories = rows.map((category) => ({ postId: post.id, categoryId: category.id }));
      
      await PostCategory.bulkCreate(postCategories, { transaction: t });

      return post;
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { add };