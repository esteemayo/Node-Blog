const passport = require('passport');

module.exports = async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
}