const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A post must have a title']
    },
    category: {
        type: String,
        required: [true, 'A post must have a category']
    },
    body: {
        type: String,
        required: [true, 'A post must have a body']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A post must have an author']
    },
    comments: [
        {
            name: {
                type: String,
                required: [true, 'Please tell us your name']
            },
            email: {
                type: String,
                required: [true, 'Please provide your email address'],
                lowercase: true
            },
            body: {
                type: String,
                required: [true, 'Comment body field is required']
            },
            commentdate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'noimage.jpg'
    }
});

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'firstName lastName'
    });

    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;