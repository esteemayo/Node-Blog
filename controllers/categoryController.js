const _ = require('lodash');
const Category = require('../models/Category');
const factory = require('../controllers/handlerFactory');
// const Post = require('../models/Post');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);