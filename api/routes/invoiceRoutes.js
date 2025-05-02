const express = require('express');
const router = express.Router();
const {
    getAllInvoices,
    getById,
    getByCustomerId,
    getInvoiceStatus,
    getCustomerUnpaidInvoices,
    getUnpaidInvoices
} = require("../controllers/invoiceController");

//get all invoices
router.get("/", getAllInvoices);
//get by invoice id
router.get("/id", getById);         
//get by customer id
router.get("/customer", getByCustomerId);
//get invoice status
router.get("/status", getInvoiceStatus);
//get unpaid invoices
router.get("/unpaid", getUnpaidInvoices);
//get unpaid invoices by customer id    
router.get("/unpaid/customer", getCustomerUnpaidInvoices); 

module.exports = router;