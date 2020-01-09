const express = require('express');
const router = express.Router();

// CONTROLLERS
const login = require('../controllers/login');
const loginLogic = require('../controllers/loginLogic');
const logout = require('../controllers/logout');

// GET USERS LOGIN ROUTE
router.get('/login', login);

// POST USERS LOGIN LOGIC
router.post('/login', loginLogic);

// GET USERS LOGOUT ROUTE
router.get('/logout', logout);

module.exports = router;