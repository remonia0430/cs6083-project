const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const router = express.Router();
const {
    getAllBooks,
    getByTitle,
    getById,
    getByAuthor,
    getMostBorrowed,
    getMyBorrows,
    rentBook,
    returnBook,
    addBook,
    addCopy,
    delBook,
    delCopy,
} = require("../controllers/bookController");

//get all books
router.get("/", getAllBooks);

//get by book id
router.get("/id", getById);

//search by book name
router.get("/search", getByTitle);

//search by author
router.get("/search/author", getByAuthor);

router.get("/trend", getMostBorrowed);

router.get("/myBorrows", verifyToken, getMyBorrows);

//rent a book
router.post("/rental/rent", verifyToken, rentBook);

//return a book
router.put("/rental/return", verifyToken, returnBook);

//create a new book
router.post("/add", verifyToken, isAdmin, addBook);

//add a new copy
router.post("/add/copy", verifyToken, isAdmin, addCopy);

//remove a book
router.delete("/del", verifyToken, isAdmin, delBook);

//remove a copy
router.delete("/del/copy", verifyToken, isAdmin, delCopy);

module.exports = router;