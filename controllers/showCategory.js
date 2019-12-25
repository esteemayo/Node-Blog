const Post = require('../models/Post');

module.exports = async (req, res) => {
    try {
        const posts = await Post.find({ category: req.params.category });
        res.render('index', { posts });
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}