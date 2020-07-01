const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');
const createError = require('http-errors');
const passport = require('passport');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const cors = require('cors');
const hpp = require('hpp');

// Routes
const globalErrorHandler = require('../controllers/errorController');
const categoryRoute = require('../routes/categories');
const AppError = require('../utils/appError');
const postRoute = require('../routes/posts');
const userRoute = require('../routes/user');
const viewRoute = require('../routes/view');

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

    // Implement cors
    app.use(cors());

    // Access-Control-Allow-Origin
    app.options('*', cors());

    // view engine setup
    app.set('views', path.join(`${__dirname}/../views`));
    app.set('view engine', 'jade');

    // Set security http headers
    app.use(helmet());

    // Development logging
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Limit request from same api
    const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000, // 1hr
        message: 'Too many requests from this IP, Please try again in an hour!'
    });

    app.use('/api', limiter);

    // Express body-parser middleware
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Cookie-parser middleware
    app.use(cookieParser());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp({
        whitelist: [
            'title',
            'category',
            'author'
        ]
    }));

    app.use(compression());

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
};