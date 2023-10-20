const express = require('express');
const router = express.Router();

const deliveryController = require('../../controllers/deliveryMan/deliveryController');
const deliveryMiddleware = require('../../middlewares/deliveryMiddleware');
const tokenMiddleware = require('../../middlewares/tokenMiddleware');

router.get('/me',
    [tokenMiddleware, deliveryMiddleware],
    deliveryController.getDeliveryMan);

module.exports = router;