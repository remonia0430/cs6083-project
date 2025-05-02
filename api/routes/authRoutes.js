const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    register,
    login,
    setAdmin
} = require("../controllers/authController");

//login
router.get("/login", login);

//register
router.post("/register", register);

router.put("/setAdmin", verifyToken, isAdmin, setAdmin);

module.exports = router;