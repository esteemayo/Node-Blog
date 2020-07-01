const _ = require('lodash');
// const crypto = require('crypto');
const passport = require('passport');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');
// const sendEmail = require('../utils/email');

exports.signup = catchAsync(async (req, res, next) => {
    const body = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'confirm']);

    const user = await User.create(body);

    user.password = undefined;

    const url = `${req.protocol}://${req.get('host')}/auth/login`;
    await new sendEmail(user, url).sendWelcome();

    res.status(201).redirect('/auth/login');
});

exports.login = catchAsync(async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/auth/login');
};

exports.forgot = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });


    /*
    const message = `Forgot your password? Submit a PATCH request with your new password and 
    passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, 
    please ignore this email!`;
    
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

        // res.status(200).json({
        //     status: 'success',
        //     message: 'Token sent to email'
        // });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).redirect('/auth/forgot');

        // return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
});

exports.resetPasswordForm = catchAsync(async (req, res, next) => {
    // const hashedToken = crypto
    //     .createHash('sha256')
    //     .update(req.params.token)
    //     .digest('hex');

    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.status(200).redirect('/auth/forgot');
    }
    res.status(200).render('forgot/reset', {
        title: 'Reset your account password',
        token: req.params.token
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // const hashedToken = crypto
    //     .createHash('sha256')
    //     .update(req.params.token)
    //     .digest('hex');

    // const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        // return next(new AppError('Token is invalid or has expired', 400));
        req.flash('error', 'Token is invalid or has expired.');
        return res.redirect('back');
    }

    user.password = req.body.password;
    user.confirm = req.body.confirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.flash('success', 'Success! Your password has been changed.');
    res.status(200).redirect('/');

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         user
    //     }
    // });
});

exports.protect = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/login');
};

exports.getRegisterForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.render('users/register');
};

exports.getLoginForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.status(200).render('users/login', {
        title: 'Login form'
    });
};

exports.forgotForm = (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/');
    res.status(200).render('forgot/forgot');
};


exports.apiLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password'));
    }

    user.password = undefined;

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});