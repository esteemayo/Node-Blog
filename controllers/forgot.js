

module.exports = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('forgot/forgot');
}