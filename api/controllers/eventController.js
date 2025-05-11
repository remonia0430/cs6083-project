const db = require("../config/DBconfig");
const { param } = require("../routes/bookRoutes");

/**Events */
const getAllEvents = async (req, res) => {
    const { type, sdate, edate } = req.query;
  
    let sql = `SELECT e.*,
                      t.TNAME AS TopicName,
                CASE
                    WHEN e.ETYPE = 'HXY_SEMINAR' 
                    THEN GROUP_CONCAT(CONCAT(a.AFNAME, ' ', a.ALNAME) SEPARATOR ', ')
                    ELSE NULL
                END AS AuthorName
                FROM HXY_EVENT e
                JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID
                LEFT JOIN HXY_AUTHOR_SEMINAR sa ON sa.ENVENTID = e.ENVENTID
                LEFT JOIN HXY_AUTHOR a ON sa.AUTHNO = a.AUTHNO WHERE 1=1`;
    params = [];
    if (type === 'HXY_SEMINAR') {
        sql += ' AND e.ETYPE = "HXY_SEMINAR"';
    } 
    else if (type === 'HXY_EXHIBITION') {
        sql += ' AND e.ETYPE = "HXY_EXHIBITION"';
    }
  
    if (sdate) {
        if(!edate){
            sql += ' AND ? BETWEEN e.STARTDATE AND e.ENDDATE';
            params.push(sdate);
        } 
        else{
            sql += ' AND NOT (e.ENDDATE < ? OR e.STARTDATE > ?)';
            params.push(sdate, edate);
        }
    }
    sql += ' GROUP BY e.ENVENTID ORDER BY e.STARTDATE ASC';
    try {
        const [rows] = await db.execute(sql, params);
        res.status(200).json({ success: true, events: rows });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
}
  
const getById = async(req, res) => {
    const sql = `SELECT e.*, 
                        t.TNAME AS Topic,
                        CASE
                            WHEN e.ETYPE = 'HXY_SEMINAR' 
                            THEN CONCAT(a.AFNAME, ' ', a.ALNAME)
                            ELSE NULL
                        END AS Author
                 FROM HXY_EVENT e 
                 JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID 
                 LEFT JOIN HXY_AUTHOR_SEMINAR sa ON sa.ENVENTID = e.ENVENTID
                 LEFT JOIN HXY_AUTHOR a ON sa.AUTHNO = a.AUTHNO
                 WHERE e.ENVENTID = ?`;
    
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{
        const [events] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", events});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getFullInfoById = async(req, res) => {
    const typeSQL = "SELECT ETYPE as type FROM HXY_EVENT WHERE ENVENTID = ?"
    
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{
        const [typeCheck] = await db.execute(typeSQL, [id]);
        let sql = "";
        if(typeCheck.length === 0) return res.status(400).json({success: false, code: 102, message: 'event not found'});
        if(typeCheck[0].type !== "HXY_SEMINAR" && typeCheck[0].type !== "HXY_EXHIBITION") return res.status(400).json({success: false, message: 'event type not found'});
        console.log(typeCheck[0].type);
        if(typeCheck[0].type === "HXY_SEMINAR"){
            sql = `SELECT e.*,
                                t.TNAME AS Topic,
                                GROUP_CONCAT(DISTINCT CONCAT(a.AFNAME, ' ', a.ALNAME) SEPARATOR ",")AS Author,
                                CASE 
                                    WHEN s.STYPE = 'HXY_ORGANIZAITON' THEN os.ONAME
                                    WHEN s.STYPE = 'HXY_INDIVIDUAL' THEN GROUP_CONCAT(DISTINCT CONCAT(ps.SFNAME, ' ', ps.SLNAME) SEPARATOR ",")
                                    ELSE NULL
                                END AS Sponsor,
                                es.AMOUNT AS Amount
                        FROM HXY_EVENT e
                        JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID
                        LEFT JOIN HXY_AUTHOR_SEMINAR sa ON sa.ENVENTID = e.ENVENTID
                        LEFT JOIN HXY_AUTHOR a ON sa.AUTHNO = a.AUTHNO
                        LEFT JOIN HXY_EVENT_SPONSOR es ON es.ENVENTID = e.ENVENTID
                        JOIN HXY_SPONSOR s ON es.SPONSORNO = s.SPONSORNO
                        LEFT JOIN HXY_ORGANIZATION os ON s.STYPE = 'HXY_ORGANIZATION' AND es.SPONSORNO = os.SPONSORNO
                        LEFT JOIN HXY_INDIVIDUAL ps ON s.STYPE = 'HXY_INDIVIDUAL' AND es.SPONSORNO = ps.SPONSORNO
                        WHERE e.ENVENTID = ?
                        GROUP BY e.ENVENTID
                        `
        }
        else{
            sql = `SELECT e.*, t.TNAME AS Topic, ex.EXPENSE as Expense
                        FROM HXY_EVENT e
                        JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID
                        JOIN HXY_EXHIBITION ex ON ex.ENVENTID = e.ENVENTID
                        WHERE e.ENVENTID = ?`
        }
        console.log(sql);
        const [events] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", events});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getByName = async(req, res) => {
    const typeSQL = "SELECT ETYPE as type FROM HXY_EVENT WHERE ENAME LIKE ?"
    
    const name = req.query.name;

    if(!name) res.status(400).json({success: false, code: 100, message: 'name required'});

    try{
        const sql = `SELECT e.*,
                            t.TNAME AS TopicName,
                            CASE 
                                WHEN e.ETYPE = 'HXY_SEMINAR' 
                                THEN GROUP_CONCAT(DISTINCT CONCAT(a.AFNAME, ' ', a.ALNAME) SEPARATOR ', ')
                                ELSE NULL
                            END AS Author
                    FROM HXY_EVENT e
                    JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID
                    LEFT JOIN HXY_AUTHOR_SEMINAR sa ON e.ENVENTID = sa.ENVENTID
                    LEFT JOIN HXY_AUTHOR a ON sa.AUTHNO = a.AUTHNO
                    WHERE e.ENAME LIKE ?
                    ORDER BY e.STARTDATE ASC`;

        const[events] = await db.execute(sql, [`%${name}%`]);
        res.status(200).json({success: true, message:"ok", events});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getByTopic = async(req, res) => {
    const topic = req.query.topicID;

    if(!topic) res.status(400).json({success: false, code: 100, message: 'topic required'});

    try{
        const sql = `SELECT e.*,
                            t.TNAME AS TopicName,
                            CASE 
                                WHEN e.ETYPE = 'HXY_SEMINAR' 
                                THEN CONCAT(a.AFNAME, ' ', a.ALNAME)
                                ELSE NULL
                            END AS Author
                    FROM HXY_EVENT e
                    JOIN HXY_TOPIC t ON e.TOPICID = t.TOPICID
                    LEFT JOIN HXY_AUTHOR_SEMINAR sa ON e.ENVENTID = sa.ENVENTID
                    LEFT JOIN HXY_AUTHOR a ON sa.AUTHNO = a.AUTHNO
                    WHERE e.TOPICID = ?
                    ORDER BY e.STARTDATE ASC`;

        const[events] = await db.execute(sql, [topic]);
        res.status(200).json({success: true, message:"ok", events});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const cancelEvent = async(req, res) =>{
    const eventID = req.query.id;
    if(!eventID) res.status(400).json({success: false, code: 100, message: 'event id required'});

    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const sql = "SELECT * FROM HXY_EVENT WHERE ENVENTID = ?";
        const [event] = await conn.execute(sql, [eventID]);
        if(event.length === 0) return res.status(400).json({success: false, code: 102, message: 'event not found'});      
        
        const sql2 = "update HXY_EVENT set STATUS = 1 WHERE ENVENTID = ?";
        await conn.execute(sql2, [eventID]);
        await conn.commit();
        conn.release();

        res.status(200).json({success: true, message: "cancelled"});
    }
    catch(err){
        conn.rollback();
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

/* SEMINARS */
const getSeminarByAuthor = async (req, res) => {
    const author = req.query.author;
  
    if (!author) {
        return res.status(400).json({ success: false, code: 100, message: 'missing fields' });
    }
  
    const sql = `SELECT E.* , CONCAT(A.AFNAME, " ", A.ALNAME) as Author
                FROM HXY_EVENT E
                LEFT JOIN HXY_AUTHOR_SEMINAR SA ON E.ENVENTID = SA.ENVENTID
                LEFT JOIN HXY_AUTHOR A ON SA.AUTHNO = A.AUTHNO
                JOIN HXY_TOPIC T ON E.TOPICID = T.TOPICID
                WHERE A.AUTHNO = ?;`;
  
    try {
        const [seminars] = await db.execute(sql, [author]);
                
        res.status(200).json({ success: true, seminars });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'error' });
    }
}


const addSeminar = async (req, res) => {
    const { name, sdate, edate, topic, authorNO, invid, sponsorNO, amount} = req.body;
    
    if (!name || !sdate || !edate || !topic || !authorNO || !invid || !sponsorNO || !amount) {
        return res.status(400).json({ success: false, code: 100, message: 'missing fields' });
    }
  
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const addEvent = "INSERT INTO HXY_EVENT(ENAME, ETYPE, STARTDATE, ENDDATE, TOPICID) VALUE(?, ?, ?, ?, ?)";
        const [result] = await conn.execute(addEvent, [name, "HXY_SEMINAR", sdate, edate, topic]);
        const eventID = result.insertId;
        
        const addSeminar = `INSERT INTO HXY_SEMINAR(ENVENTID) VALUE(?);`;
        const addA_S = `INSERT INTO HXY_AUTHOR_SEMINAR(INVID, ENVENTID, AUTHNO) VALUE(?, ?, ?); `;
        const addE_S = `INSERT INTO HXY_EVENT_SPONSOR(AMOUNT, ENVENTID, SPONSORNO) VALUE(?, ?, ?);`;
        await conn.execute(addSeminar, [eventID]);
        await conn.execute(addA_S, [invid, eventID, authorNO]);
        await conn.execute(addE_S, [amount, eventID, sponsorNO]);
        
        await conn.commit();
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    } 
    finally {
        conn.release();
    }
    res.status(200).json({ success: true, message: 'Seminar added' });
}

/* EXHIBITIONS */ 
const addExhibition = async (req, res) => {    
    const { name, sdate, edate, topic, expense } = req.body;
    
    if (!name || !sdate || !edate || !topic) {
        return res.status(400).json({ success: false, code: 100, message: 'missing fields' });
    }
  
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const addSQL = "INSERT INTO HXY_EVENT(ENAME, ETYPE, STARTDATE, ENDDATE, TOPICID) VALUE(?, ?, ?, ?, ?)";
        const [result] = await conn.execute(addSQL, [name, "HXY_EXHIBITION", sdate, edate, topic]);
        const eventID = result.insertId;
        
        const addExhibitionSQL = "INSERT INTO HXY_EXHIBITION(ENVENTID, EXPENSE) VALUE(?, ?)";
        await conn.execute(addExhibitionSQL, [eventID, expense]);
        
        await conn.commit();
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    } 
    finally {
        conn.release();
    }
    res.status(200).json({ success: true, message: 'Exhibition added' });
}

const registerExhibition = async(req, res) =>{
    const {regID, eventID} = req.body;
    const userID = req.user.id;
    if(!regID || !eventID || !userID) res.status(400).json({success: false, code: 100, message: 'event id and user id required'});

    try{
        const sql = "INSERT INTO HXY_CUSTOMER_EXHIBITION(REGID, ENVENTID, CUSTNO) VALUE(?, ?, ?)";
        await db.execute(sql, [regID, eventID, userID]);

        res.status(200).json({success: true, message: "registered"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const cancelRegirtration = async(req, res) =>{
    const {regID} = req.body;
    if(!regID) res.status(400).json({success: false, code: 100, message: 'event id and user id required'});
    
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();
        const sql = "SELECT * FROM HXY_CUSTOMER_EXHIBITION WHERE REGID = ?";
        const [reg] = await conn.execute(sql, [regID]);
        if(reg.length === 0) return res.status(400).json({success: false, code: 102, message: 'registration not found'});      
        
        const sql2 = "update HXY_CUSTOMER_EXHIBITION set ISCANCELLED = 1 WHERE REGID = ?";
        await conn.execute(sql2, [regID]);
        await conn.commit();
        conn.release();

        res.status(200).json({success: true, message: "cancelled"});
    }
    catch(err){
        conn.rollback();
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

module.exports = {
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
}