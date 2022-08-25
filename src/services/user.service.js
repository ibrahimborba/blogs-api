const { User } = require('../database/models');
const tokenHelper = require('../helpers/token');

const login = async ({ email, password }) => {
  const result = await User.findOne({ where: { email, password } });

  if (!result) return null;
  
  const token = tokenHelper.create({ email: result.email });
  return token;
};

module.exports = { login };
