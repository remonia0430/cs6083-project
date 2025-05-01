const express = require('express');
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
router.post("/add", addAuthor);

router.put("/update", updateAuthor);

//remove a author
router.delete("/del", delAuthor);

module.exports = router;