const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validators');

// GET routes for login and register pages
router.get('/login', authController.getLoginPage);
router.get('/register', authController.getRegisterPage);

// POST routes for registration and login
router.post('/register', validateRegistration, authController.registerUser);
router.post('/auth', validateLogin, authController.loginUser);

// GET route for logout
router.get('/logout', authController.logoutUser);

module.exports = router;
