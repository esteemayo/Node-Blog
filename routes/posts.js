const express = require('express');
const postController = require('../controllers/postController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router
    .route('/')
    .get(postController.getAllPosts)
    .post(
        imageController.upload,
        imageController.resize,
        postController.createPost
    );

router
    .route('/:id')
    .get(postController.getPost)
    .patch(
        imageController.upload,
        imageController.resize,
        postController.updatePost
    )
    .delete(postController.deletePost);

module.exports = router;