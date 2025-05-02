const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllSponsors,
    getById,
    addSponsor,
    delSponsor,
} = require("../controllers/sponsorController");

//get all sponsors
router.get("/", verifyToken, isAdmin, getAllSponsors);

//get by sponsor id
router.get("/id", verifyToken, isAdmin, getById);

//create a new sponsor
router.post("/add", verifyToken, isAdmin, addSponsor);

//remove a sponsor
router.delete("/del", verifyToken, isAdmin, delSponsor);

module.exports = router;