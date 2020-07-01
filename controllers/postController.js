const _ = require('lodash');
const multer = require('multer');
const Post = require('../models/Post');
const factory = require('../controllers/handlerFactory');
// const Category = require('../models/Category');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// const APIFeature = require('../utils/apiFeature');

const upload = multer({ dest: './public/images' });

exports.uploadPostImage = upload.single('image');

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);