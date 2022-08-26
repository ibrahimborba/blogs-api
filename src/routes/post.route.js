const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const postMiddleware = require('../middlewares/post.middleware');

const router = express.Router();

router.route('/')
  .post(
    authMiddleware.tokenValidation, postMiddleware.postValidator, postController.add,
  );

module.exports = router;