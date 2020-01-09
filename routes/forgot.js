const express = require('express');
const router = express.Router();

// CONTROLLERS
const forgot = require('../controllers/forgot');
const forgotLogic = require('../controllers/forgotLogic');

// GET USERS FORGOT ROUTE
router.get('/', forgot);

// POST USERS FORGOT LOGIC
router.post('/', forgotLogic);

module.exports = router;