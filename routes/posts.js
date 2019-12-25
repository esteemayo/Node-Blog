const express = require('express')
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/images' });
const Post = require('../models/Post');

// CONTROLLERS
const add = require('../controllers/addPost');
const show = require('../controllers/showPost');
const comment = require('../controllers/comment');

// GET ADD POST ROUTE
router.get('/add', add);

// GET SHOW ROUTE
router.get('/show/:id', show);

// POST COMMENT ROUTE
router.post('/addcomment/:id', comment)

// POST ADD-POST LOGIC
router.post('/add', upload.single('mainimage'), (req, res) => {
    const { title, category, body, author } = req.body;

    // Check File Upload
    let mainimage;
    if (req.file) {
        mainimage = req.file.filename;
    } else {
        mainimage = 'noimage.jpg';
    }

    let errors = [];
    if (!title) {
        errors.push(msg, 'Title field is required.');
    }

    if (!body) {
        errors.push(msg, 'Body field is required.');
    }

    if (errors.length > 0) {
        res.render('addpost', {
            errors,
            title,
            category,
            body,
            author
        });
    } else {
        const post = new Post({
            title,
            category,
            body,
            author,
            mainimage
        });

        post.save()
            .then(post => {
                req.flash('success', 'Post Added.');
                res.redirect('/');
            });
    }
});

module.exports = router;