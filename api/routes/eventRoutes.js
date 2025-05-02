const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllEvents,
    getById,
    getFullInfoById,
    getByName,
    getByTopic,
    getSeminarByAuthor,
    registerExhibition,
    cancelRegirtration,
    addExhibition,
    addSeminar,
    cancelEvent
} = require("../controllers/eventController");

/* EVENTS */
//get all events
router.get("/", getAllEvents);

//get basic information by event id
router.get("/id", getById);

router.get("/topic", getByTopic);

//get full information by event id for admin
router.get("/info", verifyToken, isAdmin, getFullInfoById);

//search by event name
router.get("/search", getByName);

//cancel a event
router.delete("/cancel", verifyToken, isAdmin, cancelEvent);

/* SEMINARS */
//search seminar by author
router.get("/seminar/author", getSeminarByAuthor);

//add a new seminar
router.post("/seminar/add", verifyToken, isAdmin, addSeminar);

/* EXHIBITIONS */

//add a new exhibition
router.post("/exhibition/add", verifyToken, isAdmin, addExhibition);

//regiser to an exhibition
router.post("/exhibition/register", verifyToken, registerExhibition);

//cancel a registristion
router.delete("/exhibition/cancel", verifyToken, cancelRegirtration);

module.exports = router;