const userService = require('../services/user.service');

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login({ email, password });
  if (!result) return res.status(400).json({ message: 'Invalid fields' });
  res.status(200).json({ token: result });
};

module.exports = { login };