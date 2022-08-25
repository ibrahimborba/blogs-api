const express = require('express');
const categoriesController = require('../controllers/categories.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const categoriesMiddleware = require('../middlewares/categories.middleware');

const router = express.Router();

router.route('/')
  .post(
    authMiddleware.tokenValidation,
    categoriesMiddleware.categoryValidator,
    categoriesController.add,
  );

module.exports = router;