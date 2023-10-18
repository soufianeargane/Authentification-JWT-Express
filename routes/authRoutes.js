const authController = require('../controllers/authController');
const tokenMiddleware = require('../middlewares/tokenMiddleware');
const alreadyLoggedInUser = require('../middlewares/alreadyLoggedInUser');

const express = require('express');
const router = express.Router();


router.post('/register',alreadyLoggedInUser, authController.register);
router.get('/activate/:token', authController.activate);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post(/forgotpassword/, alreadyLoggedInUser,authController.forgotPassword);
router.post('/resetpassword/:token',tokenMiddleware,authController.resetPassword);

module.exports = router;