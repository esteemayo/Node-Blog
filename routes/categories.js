const express = require('express');
const router = express.Router();

// CONTROLLERS
const add = require('../controllers/addCategory');
const show = require('../controllers/showCategory');
const postCategories = require('../controllers/postCategories');

// GET ADD-CATEGORY ROUTE
router.get('/add', add);

// GET SHOW CATEGORY ROUTE
router.get('/show/:category', show);

// POST CATEGORY ROUTE
router.post('/add', postCategories);

module.exports = router;