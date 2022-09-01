const Users = require('./Users.json');
const BlogPosts = require('./BlogPosts.json');

const mockFindOne = (Entity, where) => {
  if (!where) return Entity[0];
  if (where.id) where.id = Number(where.id);

  const options = Object.keys(where);
  const result = Entity.find((instance) => {
    return options.every((option) => where[option] === instance[option]);
  });

  return result;
};

const mockFindAll = (Entity) => {
  const usersWithoutPassword = Entity.map(({password, ...user}) => user);
  return usersWithoutPassword;
};

const mockFindByPk = (Entity, id) => {
  const result = Entity.find((instance) => instance.id === Number(id));
  if(!result) return null;
  const withoutPassword = { ...result };
  delete withoutPassword.password;
  return withoutPassword;
};

const mockCreate = (Entity, newInstance) => {
  Entity.push(newInstance);
  return newInstance;
};

const mockFindAndCountAll = (Entity, where) => {
  if (!where) return Entity[0];
  const options = Object.keys(where);
  const result = Entity.filter((instance) => {
    return options.every((option) => where[option]
      .some((whereOption) => whereOption === instance[option]));
  });
  return { count: result.length, rows: result };
};

const mockBulkCreate = (Entity, newInstances) => {
  newInstances.forEach((instance) => Entity.push(instance));
}

const mockUpdate = (Entity, fields, { where }) => {
  if (!where) return Entity[0];
  if (where.id) where.id = Number(where.id);

  const options = Object.keys(where);
  const result = Entity.find((instance) => {
    return options.every((option) => where[option] === instance[option]);
  });
  if(!result) return null;

  const editFields = Object.keys(fields);
  editFields.forEach((field) => result[field] = fields[field]);
  return result;
};

const mockDestroy = (Entity, where) => {
  if (!where) return Entity[0];
  if (where.id) where.id = Number(where.id);

  const options = Object.keys(where);
  const result = Entity.find((instance) => {
    return options.every((option) => where[option] === instance[option]);
  });
  if(!result) return null;

  const editFields = Object.keys(fields);
  editFields.forEach((field) => result[field] = fields[field]);
  return result;
};

const User = {
  findAll: async () => mockFindAll(Users),
  findOne: async ({ where }) => mockFindOne(Users, where),
  findByPk: async (id) => mockFindByPk(Users, id),
  create: async (newUser) => mockCreate(Users, newUser)
};

const BlogPost = {
  findAll: async () => mockFindAll(BlogPosts),
  findOne: async ({ where }) => mockFindOne(BlogPosts, where),
  findByPk: async (id) => mockFindByPk(BlogPosts, id),
  create: async (newPost) => mockCreate(BlogPosts, newPost),
  update: async (fields, where) => mockUpdate(BlogPosts, fields, where),
  destroy: async ({ where }) => mockDestroy(BlogPosts, where),
};

const Category = {
  findAndCountAll: async ({ where }) => mockFindAndCountAll(BlogPosts, where),
}

const PostCategory = {
  bulkCreate: async (newPost) => mockBulkCreate(BlogPosts, newPost),
}

module.exports = {
  User,
  BlogPost,
  Category,
  PostCategory
};