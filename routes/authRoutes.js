const userController = require('../controllers/userController');

const express = require('express');
const router = express.Router();


router.post('/register', userController.register);
router.post('/login/:token', userController.login);

module.exports = router;