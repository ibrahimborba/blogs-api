const express = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const categoryMiddleware = require('../middlewares/category.middleware');

const router = express.Router();

router.route('/')
  .post(
    authMiddleware.tokenValidation, categoryMiddleware.categoryValidator, categoryController.add,
  )
  .get(authMiddleware.tokenValidation, categoryController.getAll);

module.exports = router;