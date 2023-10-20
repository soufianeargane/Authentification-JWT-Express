const clientController = require('../../controllers/client/clientController');
const clientMiddleware = require('../../middlewares/clientMiddleware');
const tokenMiddleware = require('../../middlewares/tokenMiddleware');

const express = require('express');
const router = express.Router();

// router.get('/client/me', [''] ,clientController.getClient);
router.get('/me', [tokenMiddleware, clientMiddleware] ,clientController.getClient);
module.exports = router;