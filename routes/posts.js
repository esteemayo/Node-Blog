const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images' });
const auth = require('../middleware/auth');

// CONTROLLERS
const add = require('../controllers/addPost');
const show = require('../controllers/showPost');
const comment = require('../controllers/comment');
const post = require('../controllers/postLogic');

// GET ADD POST ROUTE
router.get('/add', auth, add);

// GET SHOW ROUTE
router.get('/show/:id', auth, show);

// POST COMMENT ROUTE
router.post('/addcomment/:id', auth, comment)

// POST ADD-POST LOGIC
router.post('/add', auth, upload.single('image'), post);

module.exports = router;