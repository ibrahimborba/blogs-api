const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const postMiddleware = require('../middlewares/post.middleware');

const router = express.Router();

router.route('/')
  .post(
    authMiddleware.tokenValidation, postMiddleware.postValidator, postController.add,
  )
  .get(authMiddleware.tokenValidation, postController.getAll);

router.route('/search')
  .get(authMiddleware.tokenValidation, postController.search);

router.route('/:id')
  .get(authMiddleware.tokenValidation, postController.getById)
  .put(
    authMiddleware.tokenValidation, postMiddleware.updateValidator, postController.update,
  )
  .delete(authMiddleware.tokenValidation, postController.remove);

module.exports = router;