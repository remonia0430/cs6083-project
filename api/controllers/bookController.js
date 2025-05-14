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
    if(!id) return res.status(400).json({success: false, code: 100, message: "Book id required"});

    const book = `SELECT 
                    b.BOOKNO as BookNo,
                    b.BNAME as Title,
                    t.TNAME as Topic,
                    CONCAT(a.AFNAME, ' ', a.ALNAME) as Author,
                    (SELECT COUNT(*) FROM HXY_COPY 
                        WHERE BOOKNO = b.BOOKNO 
                        AND STATUS = 'Available') as AvailableAmount
                FROM HXY_BOOK b
                JOIN HXY_TOPIC t ON b.TOPICID = t.TOPICID
                JOIN HXY_BOOK_AUTHOR ba on b.BOOKNO = ba.BOOKNO
                JOIN HXY_AUTHOR a on ba.AUTHNO = a.AUTHNO
                WHERE b.BOOKNO = ? AND b.ISDELETED = 0
                ${bookGroup};`;
    const copy = "SELECT * FROM HXY_COPY WHERE BOOKNO = ?"

    try{
        const [books] = await db.execute(book, [id]);
        if(books.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'Book not found'});
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
    if(!title) return res.status(400).json({success: false, code: 100, message: "Book title required"});

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
    if(!author) return res.status(400).json({success: false, code: 100, message: "Book author required"});

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

const getByTopic = async(req, res) => {
    const topic = req.query.topic;
    if(!topic) return res.status(400).json({success: false, code: 100, message: "Book topic required"});

    const sql = `${bookInfo}
                WHERE b.TOPICID = ? AND b.ISDELETED = 0
                ${bookGroup};`
    try{
        const [books] = await db.execute(sql, [topic]);
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
    const {bookNO, copyNO, EReturnDate} = req.body;
    const custNO = req.user.id;
    if (!bookNO || !copyNO || !custNO || !EReturnDate) {
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }

    const borrowCheck = `SELECT 
                            COUNT(DISTINCT R.RENTID) AS RentCount
                        FROM HXY_RENTAL R
                        WHERE R.CUSTNO = ? AND R.RSTATUS != 'Returned'
                        ;`
    const invoiceCheck = 

                        `SELECT 
                        case
                            when SUM(P.PAYAMOUNT) is null then I.INVAMOUNT
                            else I.INVAMOUNT - SUM(P.PAYAMOUNT)
                        end as RemainingAmount
                        FROM HXY_INVOICE I
                        LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                        LEFT JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                        LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                        WHERE C.CUSTNO = 1
                        GROUP BY I.RENTID
                        HAVING RemainingAmount > 0;`
                            
    const checkSQL = `SELECT STATUS as status FROM HXY_COPY WHERE COPYNO = ? AND BOOKNO = ? AND ISDELETED = 0`
    const curDate = new Date();
    const erdate = new Date(EReturnDate);
    const conn = await db.getConnection();
    try{
        const [b] = await conn.execute(borrowCheck, [custNO]);
        if(b[0].RentCount >= 5){
            return res.status(400).json({success: false, code: 666, message: "User has too many rentals"});
        }
        const [i] = await conn.execute(invoiceCheck, [custNO]);
        if(i.length !== 0){
            return res.status(400).json({success: false, code: 667, message: "User has unpaid invoices"});
        }

        const [check] = await conn.execute(checkSQL, [copyNO, bookNO]);
        
        if(check.length === 0){
            return res.status(400).json({success: false, code: 102, message: "Copy doesn't exist"});
        }
        else if(check[0].status !== "Available"){
            return res.status(400).json({success: false, code: 103, message: "Copy not available"});
        }

        (await conn).beginTransaction();
        const rentalSQL = `INSERT INTO HXY_RENTAL (RSTATUS, BORROWDATE, ERETURNDATE, COPYNO, BOOKNO, CUSTNO)
                            VALUE("Borrowed", ?, ?, ?, ?, ?)`
        const updateSQL = `UPDATE HXY_COPY SET STATUS = "Not Available" WHERE COPYNO = ? AND BOOKNO = ?`;

        const [result] = await conn.execute(rentalSQL, [curDate, erdate, copyNO, bookNO, custNO]);
        const rentalID = result.insertId;

        (await conn).execute(updateSQL, [copyNO, bookNO]);
        await conn.commit();
        res.status(200).json({success: true, message:"ok", RentID: rentalID});
    }
    catch(err){
        console.error(err);
        await conn.rollback();
        return res.status(500).json({success: false, message: 'error'});
    }
}

const returnBook = async(req, res) => {
    const {bookNO, copyNO} = req.body;
    const custNO = req.user.id;
    if (!bookNO || !copyNO || !custNO) {
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }

    const checkSQL = `SELECT STATUS as status FROM HXY_COPY WHERE COPYNO = ? AND BOOKNO = ? AND ISDELETED = 0`
    const curDate = new Date();
    const conn = await db.getConnection();
    try{
        const [check] = await conn.execute(checkSQL, [copyNO, bookNO]);
        
        if(check.length === 0){
            return res.status(400).json({success: false, code: 102, message: "Copy doesn't exist"});
        }

        (await conn).beginTransaction();

        const rentalSQL = "SELECT * FROM HXY_RENTAL WHERE COPYNO = ? AND BOOKNO = ? AND CUSTNO = ? AND RSTATUS != 'Returned'";
        const [rental] = await conn.execute(rentalSQL, [copyNO, bookNO, custNO]);

        if(rental.length === 0){
            return res.status(400).json({success: false, code: 102, message: "Record not found"});
        }

        const rentalID = rental[0].RENTID;

        const returnSQL = `UPDATE HXY_RENTAL SET RSTATUS = "Returned" , ARETURNDATE = ? WHERE RENTID = ?`
        const updateSQL = `UPDATE HXY_COPY SET STATUS = "Available" WHERE COPYNO = ? AND BOOKNO = ?`;

        (await conn).execute(returnSQL, [curDate, rentalID]);
        (await conn).execute(updateSQL, [copyNO, bookNO]);
        const invoiceSQL = `SELECT * FROM HXY_INVOICE WHERE RENTID = ?`;
        const [invoice] = await conn.execute(invoiceSQL, [rentalID]);

        await conn.commit();
        res.status(200).json({success: true, message:"ok", invoice: invoice[0]});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addBook = async(req, res) => {
    const {bname, topicID, authID} = req.body;

    if(!bname || !topicID || !authID){
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }
    
    const conn = await db.getConnection();
    try{
        const checkAuthor = "SELECT AUTHNO FROM HXY_AUTHOR WHERE AUTHNO = ?;"
        const [author] = await conn.execute(checkAuthor, [authID]);

        if(author.length === 0){
            return res.status(400).json({ success: false, code: 102, message: 'Author not found' });
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
    const {bookNO} = req.body;

    if(!bookNO){
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }

    try{
        const book = "SELECT BOOKNO FROM HXY_BOOK WHERE BOOKNO = ? AND ISDELETED = 0;";
        const [books] = await db.execute(book, [bookNO]);
        if(books.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'Book not found'});
        }
        
        const sql = `INSERT INTO HXY_COPY(BOOKNO, STATUS) VALUE(?, "Available")`;
        await db.execute(sql, [bookNO]);

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
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }

    try{
        const [books] = await db.execute(book, [id]);
        if(books.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'Book not found'});
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
    const {bookNO, copyNO} = req.body;
    const copy = `SELECT COPYNO FROM HXY_COPY c 
                    JOIN HXY_BOOK b ON b.BOOKNO = c.BOOKNO
                    WHERE c.BOOKNO = ? AND c.COPYNO = ? AND b.ISDELETED = 0`;
    if(!bookNO || !copyNO){
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }
                
    try{
        const [copies] = await db.execute(copy, [bookNO, copyNO]);
        if(copies.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'Copy not found'});
        }
        await db.execute("UPDATE HXY_COPY SET ISDELETED = 1 WHERE BOOKNO = ? AND COPYNO = ?", [bookNO, copyNO]);
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

const getMostBorrowed = async (req, res) => {
    const sqlMain = `
        SELECT b.BOOKNO as BookNo,
            b.BNAME as Title,
            GROUP_CONCAT(DISTINCT CONCAT(a.AFNAME, ' ', a.ALNAME) SEPARATOR ', ') as Author,
            t.TNAME as Topic,
            COUNT(r.RENTID) as BorrowedAmount
        FROM HXY_BOOK b
        JOIN HXY_BOOK_AUTHOR ba ON b.BOOKNO = ba.BOOKNO
        JOIN HXY_AUTHOR a ON ba.AUTHNO = a.AUTHNO
        JOIN HXY_RENTAL r ON b.BOOKNO = r.BOOKNO
        JOIN HXY_TOPIC t ON b.TOPICID = t.TOPICID
        WHERE r.BORROWDATE >= ?`;

    const sqlTopic = ` AND b.TOPICID = `;
    const sqlGroup = ` GROUP BY b.BOOKNO, b.BNAME, t.TNAME `;
    const sqlEnd = ` ORDER BY BorrowedAmount DESC LIMIT `;

    // 获取参数
    let { time, topicNO, count, authorName } = req.query;

    const today = new Date();
    const sTime = new Date();
    if (time === "month") {
        sTime.setDate(today.getDate() - 30);
    } else if (time === "year") {
        sTime.setDate(today.getDate() - 365);
    } else {
        sTime.setDate(today.getDate() - 7);
    }

    if(count){
        count = parseInt(count);
    }
    else{
        count = "5";
    }

    let SQL = sqlMain;
    let attr = [sTime];

    if (topicNO) {
        SQL += sqlTopic;
        SQL += parseInt(topicNO);
    }

    SQL += sqlGroup;

    if (authorName) {
        SQL += ` HAVING GROUP_CONCAT(DISTINCT CONCAT(a.AFNAME, ' ', a.ALNAME) SEPARATOR ', ') LIKE '%${authorName}%'`;
    }

    if (count) {
        SQL += sqlEnd;
        SQL += parseInt(count);
        SQL += ";";
    }
    else {
        SQL += sqlEnd;
        SQL += "5";
        SQL += ";";
    }

    try {
        const [books] = await db.execute(SQL, attr);
        res.status(200).json({
            success: true,
            message: "ok",
            books
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
};

const getMyBorrows = async(req, res) => {
    const custNO = req.user.id;
    
    sql = `SELECT b.BOOKNO as BookNo,
                    b.BNAME as Title,
                    r.COPYNO as CopyNo,
                    r.RENTID as RentID,
                    r.BORROWDATE as BorrowDate,
                    r.ERETURNDATE as EReturnDate,
                    r.RSTATUS as Status
            FROM HXY_BOOK b
            JOIN HXY_RENTAL r ON b.BOOKNO = r.BOOKNO
            WHERE r.CUSTNO = ?
            GROUP BY b.BOOKNO, b.BNAME, r.RENTID, r.BORROWDATE, r.ERETURNDATE, r.RSTATUS
            ORDER BY r.BORROWDATE DESC;`

    try{
        const [books] = await db.execute(sql, [custNO]);
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


module.exports = {
    getAllBooks,
    getById,
    getByTitle,
    getByAuthor,
    getByTopic,
    getMyBorrows,
    getMostBorrowed,
    rentBook,
    returnBook,
    addBook,
    addCopy,
    delBook,
    delCopy
}