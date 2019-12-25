const Category = require('../models/Category');

module.exports = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('addpost', {
            title: 'Add Post',
            categories
        })
    } catch (err) {
        console.log(err);
        res.redirect('back');
    }
}