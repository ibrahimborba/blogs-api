const express = require('express');
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .post(userMiddleware.userValidator, userController.add)
  .get(authMiddleware.tokenValidation, userController.getAll);

module.exports = router;