const express = require('express');
const router = express.Router();
const {
    getAllSponsors,
    getById,
    addSponsor,
    delSponsor,
} = require("../controllers/sponsorController");

//get all sponsors
router.get("/", getAllSponsors);

//get by sponsor id
router.get("/id", getById);

//create a new sponsor
router.post("/add", addSponsor);

//remove a sponsor
router.delete("/del", delSponsor);

module.exports = router;