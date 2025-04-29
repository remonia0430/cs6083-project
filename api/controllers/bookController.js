const db = require("../config/DBconfig");


const bookInfo = `SELECT 
                    b.BOOKNO as BookNo,
                    b.BNAME as Title,
                    t.TNAME as Topic,
                    CONCAT(a.AFNAME, ' ', a.ALNAME) as Author,
                    COUNT(CASE WHEN c.STATUS = 'Available' THEN 1 END) as AvailableAmount
                FROM HXY_BOOK b
                JOIN HXY_TOPIC t ON b.TOPICID = t.TOPICID
                JOIN HXY_BOOK_AUTHOR ba on b.BOOKNO = ba.BOOKNO
                JOIN HXY_AUTHOR a on ba.AUTHNO = a.AUTHNO
                LEFT JOIN HXY_COPY c on c.BOOKNO = b.BOOKNO`;
const bookGroup = "GROUP BY b.BOOKNO, b.BNAME, t.TNAME, a.AFNAME, a.ALNAME"

const getAllBooks = async (req, res) =>{
    var sort = (req.query.sort || "bookno").toUpperCase();
    var order = (req.query.order || "asc").toUpperCase();

    //prevent sql injection
    const allowedSortFields = ['BNAME', "TOPIC", "BOOKNO"];
    const allowedOrder = ['ASC', 'DESC'];
    if (!allowedSortFields.includes(sort)) sort = 'BNAME';
    if (!allowedOrder.includes(order)) order = 'ASC';

    const sql = `${bookInfo} 
                WHERE b.ISDELETED = 0
                ${bookGroup}
                ORDER BY ${sort} ${order};`;
    try{
        const [books] = await db.execute(sql);
        res.status(200).json({
            success: true, 
            message:"ok", 
            books
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async (req, res) =>{
    const id = req.query.id;
    if(!id) return res.status(400).json({success: false, message: "Book id required"});

    const book = `${bookInfo}
                WHERE b.BOOKNO = ? AND b.ISDELETED = 0
                ${bookGroup};`;
    const copy = "SELECT * FROM HXY_COPY WHERE BOOKNO = ?"

    try{
        const [books] = await db.execute(book, [id]);
        if(books.length === 0){
            return res.status(400).json({success: false, message: 'Book not found'});
        }

        const [copies] = await db.execute(copy, [id]);
        res.json({
            success: true,
            book:{
                ...books[0],
                copies: copies
            }
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const getByTitle = async(req, res) => {
    const title = req.query.title;
    if(!title) return res.status(400).json({success: false, message: "Book title required"});

    const sql = `${bookInfo}
                WHERE b.BNAME LIKE ? AND b.ISDELETED = 0
                ${bookGroup};`
    try{
        const [books] = await db.execute(sql, [`%${title}%`]);
        res.status(200).json({
            success: true, 
            message:"ok", 
            books
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getByAuthor = async(req, res) => {
    const author = req.query.author;
    if(!author) return res.status(400).json({success: false, message: "Book author required"});

    const sql = `${bookInfo}
                WHERE CONCAT(a.AFNAME, ' ', a.ALNAME) LIKE ? AND b.ISDELETED = 0
                ${bookGroup};`
    try{
        const [books] = await db.execute(sql, [`%${author}%`]);
        res.status(200).json({
            success: true, 
            message:"ok", 
            books
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const rentBook = async(req, res) => {
    const {bookNO, copyNO, custNO, EReturnDate} = req.body;

    if (!bookNO || !copyNO || !custNO || !EReturnDate) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const checkSQL = `SELECT STATUS as status FROM HXY_COPY WHERE COPYNO = ? AND BOOKNO = ? AND ISDELETED = 0`
    const curDate = new Date();
    const erdate = new Date(EReturnDate);
    const conn = await db.getConnection();
    try{
        const [check] = await conn.execute(checkSQL, [copyNO, bookNO]);
        
        console.log(check[0].status);
        if(check.length === 0){
            return res.status(400).json({success: false, message: "Copy doesn't exist"});
        }
        else if(check[0].status !== "Available"){
            return res.status(400).json({success: false, message: "Copy not available"});
        }

        (await conn).beginTransaction();
        const rentalSQL = `INSERT INTO HXY_RENTAL (RSTATUS, BORROWDATE, ERETURNDATE, COPYNO, BOOKNO, CUSTNO)
                            VALUE("Borrowed", ?, ?, ?, ?, ?)`
        const updateSQL = `UPDATE HXY_COPY SET STATUS = "Not Available" WHERE COPYNO = ? AND BOOKNO = ?`;

        (await conn).execute(rentalSQL, [curDate, erdate, copyNO, bookNO, custNO]);
        (await conn).execute(updateSQL, [copyNO, bookNO]);

        await conn.commit();
        res.status(200).json({success: true, message:"ok"});
    }
    catch(err){
        console.error(err);
        await conn.rollback();
        return res.status(500).json({success: false, message: 'error'});
    }
}

const returnBook = async(req, res) => {
    const {bookNO, copyNO, custNO} = req.body;

    if (!bookNO || !copyNO || !custNO) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const checkSQL = `SELECT STATUS as status FROM HXY_COPY WHERE COPYNO = ? AND BOOKNO = ? AND ISDELETED = 0`
    const curDate = new Date();
    const conn = await db.getConnection();
    try{
        const [check] = await conn.execute(checkSQL, [copyNO, bookNO]);
        
        if(check.length === 0){
            return res.status(400).json({success: false, message: "Copy doesn't exist"});
        }

        (await conn).beginTransaction();
        const returnSQL = `UPDATE HXY_RENTAL SET RSTATUS = "Returned" , ARETURNDATE = ? WHERE COPYNO = ? AND BOOKNO = ? AND CUSTNO = ?`
        const updateSQL = `UPDATE HXY_COPY SET STATUS = "Available" WHERE COPYNO = ? AND BOOKNO = ?`;

        (await conn).execute(returnSQL, [curDate, copyNO, bookNO, custNO]);
        (await conn).execute(updateSQL, [copyNO, bookNO]);

        await conn.commit();
        res.status(200).json({success: true, message:"ok"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addBook = async(req, res) => {
    const {bname, topicID, authID} = req.body;

    if(!bname || !topicID){
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const conn = await db.getConnection();
    try{
        const checkAuthor = "SELECT AUTHNO FROM HXY_AUTHOR WHERE AUTHNO = ?;"
        const [author] = await conn.execute(checkAuthor, [authID]);

        if(author.length === 0){
            return res.status(400).json({ success: false, message: 'Author not found' });
        }
        const addBook = "INSERT INTO HXY_BOOK(BNAME, TOPICID) VALUE (?, ?);";
        const linkAuthor = "INSERT INTO HXY_BOOK_AUTHOR(BOOKNO, AUTHNO) VALUE(?, ?);";
        await conn.beginTransaction();
        
        await conn.execute(addBook, [bname, topicID]);
        const [rows] = await conn.execute("SELECT LAST_INSERT_ID() AS bookid;");
        const bookid = rows[0].bookid;        
        await conn.execute(linkAuthor, [bookid, authID]);
        await conn.commit();
        
        res.status(200).json({success: true, message: "Book added"});
    }
    catch(err){
        console.error(err);
        await conn.rollback();
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addCopy = async(req, res) => {
    const {bookID} = req.body;

    if(!bookID){
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try{
        const book = "SELECT BOOKNO FROM HXY_BOOK WHERE BOOKNO = ? AND ISDELETED = 0;";
        const [books] = await db.execute(book, [bookID]);
        if(books.length === 0){
            return res.status(400).json({success: false, message: 'Book not found'});
        }
        
        const sql = `INSERT INTO HXY_COPY(BOOKNO, STATUS) VALUE(?, "Available")`;
        await db.execute(sql, [bookID]);

        res.status(200).json({success: true, message: "Copy added"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const delBook = async (req, res) =>{
    const id = req.query.id;
    const book = `SELECT BOOKNO FROM HXY_BOOK b WHERE b.BOOKNO = ? AND b.ISDELETED = 0`;
    if(!id){
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try{
        const [books] = await db.execute(book, [id]);
        if(books.length === 0){
            return res.status(400).json({success: false, message: 'Book not found'});
        }

        await db.execute("UPDATE HXY_BOOK SET ISDELETED = 1 WHERE BOOKNO = ?", [id]);
        res.json({
            success: true,
            message: "book deleted"
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const delCopy = async (req, res) =>{
    const {bookID, copyID} = req.body;
    const copy = `SELECT COPYNO FROM HXY_COPY c 
                    JOIN HXY_BOOK b ON b.BOOKNO = c.BOOKNO
                    WHERE c.BOOKNO = ? AND c.COPYNO = ? AND b.ISDELETED = 0`;
    if(!bookID || !copyID){
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
                
    try{
        const [copies] = await db.execute(copy, [bookID, copyID]);
        if(copies.length === 0){
            return res.status(400).json({success: false, message: 'Copy not found'});
        }
        await db.execute("UPDATE HXY_COPY SET ISDELETED = 1 WHERE BOOKNO = ? AND COPYNO = ?", [bookID, copyID]);
        res.json({
            success: true,
            message: "copy deleted"
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}


module.exports = {
    getAllBooks,
    getById,
    getByTitle,
    getByAuthor,
    rentBook,
    returnBook,
    addBook,
    addCopy,
    delBook,
    delCopy
}