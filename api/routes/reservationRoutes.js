const express = require('express');
const router = express.Router();
const {
    getAllReservations,
    getById,
    getReservation,
    makeReservation,
    cancelReservation
} = require("../controllers/reservationController");

//get all reservations
router.get("/", getAllReservations);

router.get("/id", getById);

router.get("/search", getReservation);

router.post("/reserve", makeReservation);

router.put("/reserve/cancel", cancelReservation);

module.exports = router;