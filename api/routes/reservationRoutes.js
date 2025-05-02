const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllReservations,
    getById,
    getReservation,
    makeReservation,
    myReservation,
    cancelReservation
} = require("../controllers/reservationController");

//get all reservations
router.get("/", verifyToken, isAdmin, getAllReservations);

router.get("/id", verifyToken, isAdmin, getById);

router.get("/search", verifyToken, isAdmin, getReservation);

router.get("/my", verifyToken, myReservation);

router.post("/reserve", verifyToken, makeReservation);

router.put("/reserve/cancel", verifyToken, cancelReservation);

module.exports = router;