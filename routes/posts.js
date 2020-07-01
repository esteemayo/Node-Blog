const express = require('express');
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');

const router = express.Router();

router
    .route('/')
    .get(postController.getAllPosts)
    .post(
        postController.uploadPostImage,
        postController.resizePostImage,
        postController.createPost
    );

router
    .route('/:id')
    .get(postController.getPost)
    .patch(
        postController.uploadPostImage,
        postController.resizePostImage,
        postController.updatePost
    )
    .delete(postController.deletePost);

module.exports = router;