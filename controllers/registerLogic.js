const bcrypt = require('bcryptjs');
const _ = require('lodash');
const User = require('../models/User');

module.exports = async (req, res) => {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        res.redirect('/users/register');
    }

    user = await new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
        user.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.log(err);
    }
}