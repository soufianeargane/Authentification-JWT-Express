const express = require('express');
const router = express.Router();
const managerController = require('../../controllers/manager/managerController');
const tokenMiddleware = require('../../middlewares/tokenMiddleware');
const managerMiddleware = require('../../middlewares/managerMiddleware');

router.get('/me',
    [tokenMiddleware, managerMiddleware],
    managerController.getManager);
module.exports = router;