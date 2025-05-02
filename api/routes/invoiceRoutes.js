const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

const router = express.Router();
const {
    getAllInvoices,
    getById,
    getByCustomerId,
    getInvoiceStatus,
    getCustomerUnpaidInvoices,
    getUnpaidInvoices,
    getMyInvoices,
    getMyUnpaidInvoices
} = require("../controllers/invoiceController");

//get all invoices
router.get("/", verifyToken, isAdmin, getAllInvoices);
//get by invoice id
router.get("/id", verifyToken, isAdmin, getById);         
//get by customer id
router.get("/customer", verifyToken, isAdmin, getByCustomerId);
//get invoice status
router.get("/status", verifyToken, isAdmin, getInvoiceStatus);
//get unpaid invoices
router.get("/unpaid", verifyToken, isAdmin, getUnpaidInvoices);
//get unpaid invoices by customer id    
router.get("/unpaid/customer", verifyToken, isAdmin, getCustomerUnpaidInvoices); 
router.get("/my", verifyToken, getMyInvoices); //get my invoices
router.get("/my/unpaid", verifyToken, getMyUnpaidInvoices); //get my unpaid invoices
module.exports = router;