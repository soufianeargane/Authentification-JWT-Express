const authController = require("../controllers/authController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");
const messi = require("../middlewares/messi");

const express = require("express");
const router = express.Router();

router.post("/register", authController.register);
router.post("/activate", authController.activate);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("forgotpassword", messi, authController.forgotPassword);
router.post(
    "/resetpassword/:token",
    tokenMiddleware,
    authController.resetPassword
);
router.get("/checkauth", tokenMiddleware, authController.checkAuth);

module.exports = router;
