const _ = require('lodash');
const sharp = require('sharp');
const multer = require('multer');
const Post = require('../models/Post');
const factory = require('../controllers/handlerFactory');

exports.getAllPosts = factory.getAll(Post);
exports.getPost = factory.getOne(Post);
exports.createPost = factory.createOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.deletePost = factory.deleteOne(Post);