const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/users/register', authController.getRegisterForm);

router.post('/users/register', authController.signup);

router.post('/api/v1/users/login', authController.apiLogin);

router.get('/auth/login', authController.getLoginForm);

router.post('/auth/login', authController.login);

router.get('/auth/logout', authController.logout);

router
    .route('/auth/forgot')
    .get(authController.forgotForm)
    .post(authController.forgot);

router
    .route('/api/v1/users')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/api/v1/users/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;