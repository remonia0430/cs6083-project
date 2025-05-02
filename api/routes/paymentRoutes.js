const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllPayments,
    getById,
    getByInvoiceId,
    getByCustomerId,
    makePayment,
    myPayment
} = require("../controllers/paymentController");

//get all payments
router.get("/", verifyToken, isAdmin, getAllPayments);

//get by payment id
router.get("/id", verifyToken, isAdmin, getById);

//get by invoice id
router.get("/invoice", verifyToken, isAdmin, getByInvoiceId);

//get by customer id
router.get("/customer", verifyToken, isAdmin, getByCustomerId);

//make a payment
router.post("/pay", verifyToken, makePayment);

router.get("/my", verifyToken, myPayment);


module.exports = router;