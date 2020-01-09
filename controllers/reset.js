const User = require('../models/User');

module.exports = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot');
        }
        res.render('forgot/reset', { token: req.params.token });
    });
}