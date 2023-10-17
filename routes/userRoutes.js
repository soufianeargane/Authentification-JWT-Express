const userController = require('../controllers/userController');
const clientMiddleware = require('../middlewares/clientMiddleware');
const tokenMiddleware = require('../middlewares/tokenMiddleware');

const express = require('express');
const router = express.Router();

// router.get('/client/me', [''] ,userController.getClient);
router.get('/client/me', [tokenMiddleware, clientMiddleware] ,userController.getClient);
module.exports = router;