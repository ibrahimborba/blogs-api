const userService = require('../services/user.service');

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.login({ email, password });

  if (!result) return res.status(400).json({ message: 'Invalid fields' });
  return res.status(200).json({ token: result });
};

const add = async (req, res) => {
  const { displayName, email, password, image } = req.body;
  const result = await userService.add({ displayName, email, password, image });

  if (!result) return res.status(409).json({ message: 'User already registered' });
  return res.status(201).json({ token: result });
};

module.exports = { login, add };