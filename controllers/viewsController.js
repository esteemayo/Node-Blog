const _ = require('lodash');
const multer = require('multer');
const Post = require('../models/Post');
const Category = require('../models/Category');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const upload = multer({ dest: './public/images' });

exports.uploadPostImage = upload.single('image');

exports.getPostOverview = catchAsync(async (req, res, next) => {
    const posts = await Post.find();

    res.status(200).render('index', {
        title: 'Overview',
        posts
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(200).render('show', {
        title: post.title,
        post
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    let post = _.pick(req.body, ['title', 'category', 'body', 'author', 'comment']);

    if (req.file)
        post.image = req.file.filename
    else
        image = 'noimage.jpg';

    post = await Post.create(post);

    req.flash('success', 'Post Added.');
    res.status(201).redirect('/');
});

exports.getPostForm = catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).render('addpost', {
        title: 'Add post',
        categories
    })
});

exports.createComment = catchAsync(async (req, res, next) => {
    const { name, email, body } = req.body;

    const post = await Post.findOne({ _id: req.params.id });
    const commentObj = { name, email, body };

    post.comments.push(commentObj);
    await post.save();

    req.flash('success', 'Comment Added.');
    res.status(201).redirect(`/posts/show/${post._id}`);
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const post = await Post.find({ category: req.params.category });

    if (!post) {
        return next(new AppError('No post found with that category ID'));
    }

    res.status(200).render('index', {
        title: '',
        posts
    });
});

exports.createCategory = catchAsync(async (req, res, next) => {
    let category = _.pick(req.body, ['name']);

    category = await Category.create(category);

    req.flash('success', 'Category Added');
    res.status(201).redirect('/');
});

exports.addCategoryForm = (req, res) => {
    res.status(200).render('addcategory', {
        title: 'Add Category'
    });
};

exports.getForgotPasswordForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.status(200).render('forgot/forgot');
};