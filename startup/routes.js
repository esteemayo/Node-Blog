require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');

const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/errorController');
const postRoute = require('../routes/posts');
const categoryRoute = require('../routes/categories');
const userRoute = require('../routes/user');
const viewRoute = require('../routes/view');
const forgot = require('../routes/forgot');
const reset = require('../routes/reset');

module.exports = app => {
    // Pasport
    require('../config/passport')(passport);

    // Moment
    app.locals.moment = require('moment');

    // Truncate Text
    app.locals.truncateText = function (text, length) {
        let truncateText = text.substring(0, length);
        return truncateText;
    }

    // view engine setup
    app.set('views', path.join(`${__dirname}/../views`));
    app.set('view engine', 'jade');

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Express body-parser middleware
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Cookie-parser middleware
    app.use(cookieParser());

    // Static files
    app.use(express.static(path.join(`${__dirname}/../public`)));

    // Express Session
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    // Passport Middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Connect-flash
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    app.use((req, res, next) => {
        res.locals.user = req.user || null;
        next();
    });

    // Test middleware
    app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();
        next();
    });


    app.use('/', viewRoute);
    app.use('/', userRoute);
    // app.use('/auth/forgot', forgot);
    app.use('/auth/reset/:token', reset);
    app.use('/api/v1/posts', postRoute);
    app.use('/api/v1/categories', categoryRoute);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });


    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });

    app.use(globalErrorHandler);
}