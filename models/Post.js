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
        type: String,
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
        type: String
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;