const Post = require('../models/Post');

module.exports = (req, res) => {
    const { name, email, body } = req.body;

    let errors = [];

    if (!name) {
        errors.push(msg, 'Name field is required.');
    }

    if (!email) {
        errors.push(msg, 'Email field is required but never displayed.');
    }

    if (!body) {
        errors.push(msg, 'Body field is required.');
    }

    if (errors.length > 0) {
        res.render('show', {
            errors,
            name,
            email,
            body
        });
    } else {
        Post.findOne({ _id: req.params.id })
            .then(post => {
                const comment = {
                    name,
                    email,
                    body
                };

                post.comments.unshift(comment);
                post.save()
                    .then(post => {
                        req.flash('success', 'Comment Added.');
                        res.redirect(`/posts/show/${post._id}`);
                    });
            });
    }
}