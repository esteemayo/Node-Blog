const Post = require('../models/Post');

module.exports = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('index', { posts });
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}