const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const index = require('../routes/index');
const post = require('../routes/posts');
const categories = require('../routes/categories');

module.exports = app => {
    // Moment
    app.locals.moment = require('moment');

    // Truncate Text
    app.locals.truncateText = function (text, lenght) {
        let truncateText = text.substring(0, lenght);
        return truncateText;
    }

    // view engine setup
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    // Express Session
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    // Connect-flash
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });


    app.use('/', index);
    app.use('/posts', post);
    app.use('/categories', categories);

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
}