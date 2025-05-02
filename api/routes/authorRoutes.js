const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllAuthors,
    getById,
    addAuthor,
    updateAuthor,
    delAuthor
} = require("../controllers/authorController");

//get all authors
router.get("/", getAllAuthors);

//get by author id
router.get("/id", getById);

//create a new author
router.post("/add", verifyToken, isAdmin, addAuthor);

router.put("/update", verifyToken, isAdmin, updateAuthor);

//remove a author
router.delete("/del", verifyToken, isAdmin, delAuthor);

module.exports = router;