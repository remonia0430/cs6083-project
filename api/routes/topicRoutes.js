const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllTopics,
    getByName,
    getById,
    addTopic,
    delTopic
} = require("../controllers/topicController");

//get all topics
router.get("/", getAllTopics);

//search topic by name
router.get("/search", getByName);

//get topic by id
router.get("/id", getById);

//add a topic
router.post("/add", verifyToken, isAdmin, addTopic);

//del a topic
router.delete("/del", verifyToken, isAdmin, delTopic);

module.exports = router;