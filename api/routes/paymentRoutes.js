const express = require('express');
const router = express.Router();
const {
    getAllPayments,
    getById,
    getByInvoiceId,
    getByCustomerId,
    makePayment
} = require("../controllers/paymentController");

//get all payments
router.get("/", getAllPayments);

//get by payment id
router.get("/id", getById);

//get by invoice id
router.get("/invoice", getByInvoiceId);

//get by customer id
router.get("/customer", getByCustomerId);

//make a payment
router.post("/pay", makePayment);




module.exports = router;