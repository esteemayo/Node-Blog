const _ = require('lodash');
const Post = require('../models/Post');
const User = require('../models/User');
const Category = require('../models/Category');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getPostOverview = catchAsync(async (req, res, next) => {
    const posts = await Post
        .find()
        .sort('-date');

    res.status(200).render('index', {
        title: 'Overview',
        posts
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findOne({ 'slug': req.params.slug });

    if (!post) {
        return next(new AppError('No post found with that TITLE', 404));
    }

    res.status(200).render('show', {
        title: post.title,
        post
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const newPost = _.pick(req.body, ['title', 'category', 'body', 'comment']);

    if (!req.body.author) newPost.author = req.user.id;
    if (req.file) newPost.image = req.file.filename

    await Post.create(newPost);

    req.flash('success', 'Post added successfully.');
    res.status(201).redirect('/');
});

exports.getPostForm = catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).render('addpost', {
        title: 'Create a new post',
        categories
    })
});

exports.createComment = catchAsync(async (req, res, next) => {
    const { name, email, body } = req.body;

    const post = await Post.findOne({ _id: req.params.id });
    const commentObj = { name, email, body };

    post.comments.push(commentObj);
    await post.save();

    req.flash('success', 'Comment added successfully.');
    res.status(201).redirect(`/posts/show/${post.slug}`);
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const posts = await Post
        .find({ 'category': req.params.category })
        .sort('-date');

    res.status(200).render('index', {
        title: 'Category',
        posts
    });
});

exports.createCategory = catchAsync(async (req, res, next) => {
    const newCategory = _.pick(req.body, ['name']);

    await Category.create(newCategory);

    req.flash('success', 'Category successfully added');
    res.status(201).redirect('/');
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const filterBody = _.pick(req.body, ['firstName', 'lastName', 'email']);

    await User.findByIdAndUpdate(req.user._id, filterBody, {
        new: true,
        runValidators: true
    });

    res.redirect('back');
});

exports.addCategoryForm = (req, res) => {
    res.status(200).render('addcategory', {
        title: 'Create new category'
    });
};

exports.getForgotPasswordForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('forgot/forgot', {
        title: 'Forgot password'
    });
};

exports.account = (req, res) => {
    res.status(200).render('users/account', {
        title: 'User account settings'
    });
}