const express = require('express');
const router = express.Router();
const {
    getAllBooks,
    getByTitle,
    getById,
    getByAuthor,
    rentBook,
    returnBook,
    addBook,
    addCopy,
    delBook,
    delCopy
} = require("../controllers/bookController");

//get all books
router.get("/", getAllBooks);

//get by book id
router.get("/id", getById);

//search by book name
router.get("/search", getByTitle);

//search by author
router.get("/search/author", getByAuthor);

//rent a book
router.post("/rental/rent", rentBook);

//return a book
router.put("/rental/return", returnBook);

//create a new book
router.post("/add", addBook);

//add a new copy
router.post("/add/copy", addCopy);

//remove a book
router.delete("/del", delBook);

//remove a copy
router.delete("/del/copy", delCopy);

module.exports = router;