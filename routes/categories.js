const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// CONTROLLERS
const add = require('../controllers/addCategory');
const show = require('../controllers/showCategory');
const postCategories = require('../controllers/postCategories');

// GET ADD-CATEGORY ROUTE
router.get('/add', auth, add);

// GET SHOW CATEGORY ROUTE
router.get('/show/:category', auth, show);

// POST CATEGORY ROUTE
router.post('/add', auth, postCategories);

module.exports = router;