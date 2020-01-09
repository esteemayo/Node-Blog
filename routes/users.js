const express = require('express');
const router = express.Router();

// CONTROLLERS
const register = require('../controllers/register');
const registerLogic = require('../controllers/registerLogic');

// GET USERS REGISTER ROUTE
router.get('/', register);

// POST USERS REGISTER LOGIC
router.post('/', registerLogic);

module.exports = router;