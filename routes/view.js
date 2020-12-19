const express = require('express');
const authController = require('../controllers/authController');
const viewsController = require('../controllers/viewsController');
const imageController = require('../controllers/imageController');

const router = express.Router();

router.get('/', viewsController.getPostOverview);

router.get('/posts/add',
    authController.protect,
    viewsController.getPostForm
);

router.get('/posts/show/:slug', viewsController.getPost);

router.post('/posts/addcomment/:id', viewsController.createComment);

router.post('/posts/add',
    authController.protect,
    imageController.upload,
    imageController.resize,
    viewsController.createPost
);

router.get('/categories/add',
    authController.protect,
    viewsController.addCategoryForm
);

router.get('/categories/show/:category',
    authController.protect,
    viewsController.getCategory
);

router.post('/categories/add',
    authController.protect,
    viewsController.createCategory
);

router.get('/account/me',
    authController.protect,
    viewsController.account
);

router.post('/submit-user-data',
    authController.protect,
    viewsController.updateUserData
);

module.exports = router;