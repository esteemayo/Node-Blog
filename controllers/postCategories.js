const Category = require('../models/Category');

module.exports = (req, res) => {
    const { name } = req.body;

    let errors = [];

    if (!name) {
        errors.push(msg, 'Name field is required.');
    }

    if (errors.length > 0) {
        res.render('addcategory', {
            errors,
            name
        });
    } else {
        Category.findOne({ name })
            .then(category => {
                if (category) {
                    req.flash('error', 'Category name already exist, choose another.');
                    res.redirect('/categories/add');
                } else {
                    const category = new Category({
                        name
                    });

                    category.save()
                        .then(category => {
                            req.flash('success', 'Category Added');
                            res.redirect('/');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        });
                }
            });
    }
}