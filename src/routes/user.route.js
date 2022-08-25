const express = require('express');
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');

const router = express.Router();

// Login
router.route('/')
  .post(userMiddleware.validator, userController.login);

module.exports = router;