const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

module.exports = (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buf) => {
                let token = buf.toString('hex');
                done(err, token);
            });
        },

        function (token, done) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    res.redirect('/auth/forgot');
                }
                user.resetPasswordToken = token,
                    user.resetPasswordExpires = Date.now + 3600000 // 1 hr

                user.save(err => {
                    done(err, token, user);
                });
            });
        },

        function (token, user, done) {
            let smtpTransporter = nodemailer.createTransport({
                service: process.env.MAIL_SERVICE,
                auth: {
                    user: process.env.CLIENT_MAIL,
                    pass: process.env.CLIENT_PASSWORD
                }
            });

            let mailOptions = {
                to: user.email,
                from: process.env.CLIENT_MAIL,
                subject: 'NodeBlog Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            smtpTransporter.sendMail(mailOptions, err => {
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], err => {
        if (err) return next(err);
        res.redirect('/auth/forgot');
    });
}