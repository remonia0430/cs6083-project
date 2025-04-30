const express = require('express');
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
router.post("/add", addRoom);

//remove a room
router.delete("/del", delRoom);

module.exports = router;