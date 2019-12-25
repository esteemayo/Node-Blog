const Post = require('../models/Post');

module.exports = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('show', { post });
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}