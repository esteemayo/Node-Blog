const _ = require('lodash');
const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const catchAsync = require('../utils/catchAsync');
// const sendEmail = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'confirm', 'passwordChangedAt']);

    const user = await User.create(newUser);

    const url = `${req.protocol}://${req.get('host')}/auth/login`;
    await new sendEmail(user, url).sendWelcome();

    res.redirect('/auth/login');
});

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/auth/login',
        failureFlash: true,
        successRedirect: '/',
        successFlash: 'Welcome to Nodejs-Blog'
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
};

exports.forgot = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'There is no user with email address');
        return res.redirect('/auth/forgot');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    /*
    const message = `
        Forgot your password? Submit a PATCH request with your new password and 
        passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, 
        please ignore this email!
    `;
    
    await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message
    });
    */

   try {
        const resetURL = `${req.protocol}://${req.get('host')}/auth/reset/${resetToken}`;

        await new sendEmail(user, resetURL).sendPasswordReset();

        req.flash('success', `An e-mail has been sent to ${user.email} with further instructions.`);
        res.status(200).redirect('back');
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        req.flash('error', 'There was an error sending the email. Try again later!');
        res.redirect('/auth/forgot');
    }
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, build and render a template
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/auth/forgot');
    }

    res.status(200).render('forgot/reset', {
        title: 'Reset your account password'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        req.flash('error', 'Token is invalid or has expired.');
        return res.redirect('back');
    }

    user.password = req.body.password;
    user.confirm = req.body.confirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', 'Success! Your password has been changed.');
    res.redirect('/auth/login');
});

exports.protect = (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect('/auth/login');
};

exports.getRegisterForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('users/register', {
        title: 'Register your account!'
    });
};

exports.getLoginForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('users/login', {
        title: 'Log into your account! '
    });
};

exports.forgotForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');

    res.status(200).render('forgot/forgot', {
        title: 'Forgot password'
    });
};