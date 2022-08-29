const Users = require('./Users.json');

const mockFindOne = (Entity, where) => {
  if (!where) return Entity[0];

  const options = Object.keys(where);
  const result = Entity.find((instance) => {
    return options.every((option) => where[option] === instance[option]);
  });
  return result;
}

const User = {
  findOne: async ({ where }) => mockFindOne(Users, where),
};

module.exports = {
  User,
};