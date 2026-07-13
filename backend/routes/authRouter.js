const express = require("express");
const router = express.Router();

const { signup, login, googleLogin, logout, guestLogin } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.post("/guest", guestLogin);

module.exports = router;