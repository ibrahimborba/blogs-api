const Users = require('./Users.json');

const mockFindOne = (Entity, where) => {
  if (!where) return Entity[0];

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

const mockCreate = (Entity, newUser) => {
  Entity.push(newUser);
  return newUser;
};

const User = {
  findAll: async () => mockFindAll(Users),
  findOne: async ({ where }) => mockFindOne(Users, where),
  findByPk: async (id) => mockFindByPk(Users, id),
  create: async (newUser) => mockCreate(Users, newUser)
};

module.exports = {
  User,
};