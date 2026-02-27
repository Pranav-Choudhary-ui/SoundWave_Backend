const express = require("express");
const rateLimit = require("express-rate-limit");

const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();


// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts
  message: { message: "Too many login attempts. Try again later." },
});


// Routes
router.post("/register", authController.registerUser);

router.post("/login", loginLimiter, authController.loginUser);

router.post("/logout", authenticate, authController.logoutUser);


module.exports = router;