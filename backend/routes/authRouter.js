const express = require("express");
const router = express.Router();

const { signup, login, googleLogin, logout } = require("../controllers/authControllers");

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);

module.exports = router;