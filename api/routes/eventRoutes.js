const express = require('express');
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
router.get("/info", getFullInfoById);

//search by event name
router.get("/search", getByName);

//cancel a event
router.delete("/cancel", cancelEvent);

/* SEMINARS */
//search seminar by author
router.get("/seminar/author", getSeminarByAuthor);

//add a new seminar
router.post("/seminar/add", addSeminar);

/* EXHIBITIONS */

//add a new exhibition
router.post("/exhibition/add", addExhibition);

//regiser to an exhibition
router.post("/exhibition/register", registerExhibition);

//cancel a registristion
router.delete("/exhibition/cancel", cancelRegirtration);

module.exports = router;