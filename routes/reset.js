const express = require('express');
const router = express.Router();

// CONTROLLERS
const reset = require('../controllers/reset');
const resetLogic = require('../controllers/resetLogic');

// GET USERS RESET PASSWORD ROUTE
router.get('/', reset);

// POST USERS RESET PASSWORD LOGIC
router.post('/', resetLogic);

module.exports = router;