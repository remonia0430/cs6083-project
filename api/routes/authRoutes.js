const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    register,
    login,
    setAdmin,
    requestPasswordReset,
    verifyPasswordResetToken,
    resetPassword
} = require("../controllers/authController");

//login
router.get("/login", login);

//register
router.post("/register", register);

router.put("/setAdmin", verifyToken, isAdmin, setAdmin);

router.put("/reset/request", requestPasswordReset);

router.get("/reset/verify", verifyPasswordResetToken);

router.put("/reset", verifyToken, resetPassword);

module.exports = router;