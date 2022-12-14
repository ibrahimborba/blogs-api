const userService = require('../services/user.service');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login({ email, password });
  
    if (!result) return res.status(400).json({ message: 'Invalid fields' });
    return res.status(200).json({ token: result });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { displayName, email, password, image } = req.body;
    const result = await userService.add({ displayName, email, password, image });
  
    if (!result) return res.status(409).json({ message: 'User already registered' });
    return res.status(201).json({ token: result });
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const result = await userService.getAll();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await userService.getById(id);

    if (!result) return res.status(404).json({ message: 'User does not exist' });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { userId } = req;
  try {
    const result = await userService.remove({ userId });

    if (!result) return res.status(401).json({ message: 'Unauthorized user' });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { login, add, getAll, getById, remove };