const Post = require('../models/Post');

module.exports = (req, res) => {
    const { title, category, body, author } = req.body;

    // Check File Upload
    let image;
    if (req.file) {
        image = req.file.filename;
    } else {
        image = 'noimage.jpg';
    }

    let errors = [];
    if (!title) {
        errors.push({ msg: 'Title field is required.' });
    }

    if (!body) {
        errors.push({ msg: 'Body field is required.' });
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
            image
        });

        post.save()
            .then(post => {
                req.flash('success', 'Post Added.');
                res.redirect('/');
            });
    }
}