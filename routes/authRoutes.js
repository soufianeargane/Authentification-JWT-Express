const authController = require('../controllers/authController');

const express = require('express');
const router = express.Router();


router.post('/register', authController.register);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post(/forgotpassword/, authController.forgotPassword);

module.exports = router;