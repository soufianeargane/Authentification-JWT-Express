const userController = require('../controllers/userController');
const clientMiddleware = require('../middlewares/clientMiddleware');

const express = require('express');
const router = express.Router();

router.get('/client/me', clientMiddleware ,userController.getClient);

module.exports = router;