const mongoose = require('mongoose');
const slugify = require('slugify');

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
    slug: String,
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
    image: {
        type: String,
        default: 'post.png'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

postSchema.index({ title: 1, slug: 1 });

postSchema.pre('save', async function(next) {
    if (!this.isModified('title')) return next();

    this.slug = slugify(this.title, { lower: true });

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const postWithSlug = await this.constructor.find({ slug: slugRegEx });

    if (postWithSlug.length) {
        this.slug = `${this.slug}-${postWithSlug.length + 1}`;
    }

    next();
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