const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
    updateProfile,
    getAllCustomers
} = require("../controllers/customerController");

//get all customers
router.get("/customer", getAllCustomers);

//get user profile by id
router.get("/customer/profile", getProfile);

//update user profile
router.put("/customer/profile/update", updateProfile);


module.exports = router;