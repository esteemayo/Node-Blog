const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './configuration.env' });
const app = require('./app');

require('./startup/db')();

const PORT = 3000 || process.env.PORT;

const server = app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});