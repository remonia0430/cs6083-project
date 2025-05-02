const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    myProfile,
    getById,
    getInfoById,
    updateProfile,
    resetPassword,
    getAllCustomers
} = require("../controllers/customerController");

router.get("/me", verifyToken, myProfile);

router.get("/id", getById);

//get all customers
router.get("/", verifyToken, isAdmin, getAllCustomers);


router.get("/info", verifyToken, isAdmin, getInfoById);

//update user profile
router.put("/update", verifyToken, updateProfile);

router.put("/reset", verifyToken, resetPassword);

module.exports = router;