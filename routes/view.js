const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', authController.protect, viewsController.getPostOverview);

router.get('/posts/add', authController.protect, viewsController.getPostForm);

router.get('/posts/show/:id', authController.protect, viewsController.getPost);

router.post('/posts/addcomment/:id', authController.protect, viewsController.createComment);

router.post('/posts/add', authController.protect, viewsController.uploadPostImage, viewsController.createPost);

router.get('/categories/add', authController.protect, viewsController.addCategoryForm);

router.get('/categories/show/:category', authController.protect, viewsController.getCategory);

router.post('/categories/add', authController.protect, viewsController.createCategory);

module.exports = router;