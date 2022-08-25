const express = require('express');
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');

const router = express.Router();

router.route('/')
  .post(userMiddleware.loginValidator, userController.login);

module.exports = router;