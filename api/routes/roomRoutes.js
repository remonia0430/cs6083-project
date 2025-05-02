const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllRooms,
    getById,
    addRoom,
    delRoom,
    getAvailableSlots
} = require("../controllers/roomController");

//get all rooms
router.get("/", getAllRooms);

//get by room id
router.get("/id", getById);

//get available slots
router.get("/slots", getAvailableSlots);

//create a new room
router.post("/add", verifyToken, isAdmin, addRoom);

//remove a room
router.delete("/del", verifyToken, isAdmin, delRoom);

module.exports = router;