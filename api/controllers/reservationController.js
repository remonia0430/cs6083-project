const db = require("../config/DBconfig");
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const getAllReservations = async (req, res) =>{
    var sort = (req.query.sort || "resid").toUpperCase();
    var order = (req.query.order || "asc").toUpperCase();

    //prevent sql injection
    const allowedSortFields = ['RESID', "CUSTNO", "ROOMNO"];
    const allowedOrder = ['ASC', 'DESC'];
    if (!allowedSortFields.includes(sort)) sort = 'RESID';
    if (!allowedOrder.includes(order)) order = 'ASC';

    const sql = `SELECT * FROM HXY_RESERVATION
                WHERE ISACTIVE = 1
                ORDER BY ${sort} ${order};`;
    try{
        const [reservations] = await db.execute(sql);
        res.status(200).json({
            success: true, 
            message:"ok", 
            reservations
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async (req, res) =>{
    const id = req.query.id;
    if(!id) return res.status(400).json({success: false, code: 100, message: "Reservation id required"});

    const reservation = `SELECT * FROM HXY_RESERVATION WHERE RESID = ? AND ISACTIVE = 1;`;

    try{
        const [reservations] = await db.execute(reservation, [id]);
        if(reservations.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'Reservation not found'});
        }

        res.json({
            success: true,
            reservations
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const getReservation = async(req, res) => {
    const {roomNO, custNO, rdate} = req.body;

    let sql = `SELECT * FROM HXY_RESERVATION WHERE 1=1`;
    const params = [];
    
    if (roomNO) {
        sql += ` AND ROOMNO = ?`;
        params.push(roomNO);
    }
    if (custNO) {
        sql += ` AND CUSTNO = ?`;
        params.push(custNO);
    }
    if (rdate) {
        sql += ` AND RESDATE = ?`;
        params.push(rdate);
    }
    try{
        const [result] = await db.execute(sql, params);
        res.status(200).json({success: true, code:0, result});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const myReservation = async(req, res) => {
    const {roomNO, rdate} = req.query;

    let sql = `SELECT * FROM HXY_RESERVATION WHERE CUSTNO = ? `;
    const custNO = req.user.id;
    const params = [custNO];
    
    if (roomNO) {
        sql += ` AND ROOMNO = ?`;
        params.push(roomNO);
    }
    if (rdate) {
        sql += ` AND RESDATE = ?`;
        params.push(rdate);
    }
    try{
        const [result] = await db.execute(sql, params);
        res.status(200).json({success: true, code:0, result});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}


const makeReservation = async (req, res) => {
    const { topic, resDate, startTime, endTime, noi, roomNO } = req.body;
  
    if (!topic || !startTime || !endTime || !noi || !roomNO || !resDate) {
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }
  
    try {
        const roomCheck = "SELECT CAPACITY AS cap FROM HXY_ROOM WHERE ROOMNO = ?";
        const [room] = await db.execute(roomCheck, [roomNO]);
        if(room.length === 0){
            return res.status(400).json({success: false, code: 102, message: "Room not found"});
        }
        else{
            if(room[0].cap < noi){
                return res.status(400).json({success: false, code: 105, message: "Room capacity exceeded"});
            }
        }

        const rDate = dayjs(resDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        const sTime = dayjs(startTime, "HH:mm:ss").format('HH:mm:ss');
        const eTime = dayjs(endTime, "HH:mm:ss").format('HH:mm:ss');
        console.log({ rDate, sTime, eTime });
        if (sTime >= eTime) {
            return res.status(400).json({ success: false, code: 106, message: 'Invalid time range' });
        }
        
        const checkSQL = `
            SELECT STARTTIME, ENDTIME
            FROM HXY_RESERVATION
            WHERE ROOMNO = ? AND RESDATE = ?
        `;
        const [reservations] = await db.execute(checkSQL, [roomNO, rDate]);
    
        const conflict = reservations.some(r => {
            return sTime < r.ENDTIME && eTime > r.STARTTIME;
        });
    
        if (conflict) {
            return res.status(409).json({ success: false, code: 106, message: 'Time slot not available' });
        }
    
        const insertSQL = `
            INSERT INTO HXY_RESERVATION (ROOMNO, CUSTNO, RESDATE, STARTTIME, ENDTIME, TOPIC, NOI, ISACTIVE)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const custNO = req.user?.custno || 1; 
    
        await db.execute(insertSQL, [roomNO, custNO, rDate, sTime, eTime, topic, noi]);
    
        return res.status(200).json({ success: true, code: 0, message: 'Reservation created successfully' });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


const cancelReservation = async (req, res) =>{
    const reservationID = req.query.reservation;

    if(!reservationID){
        return res.status(400).json({ success: false, code: 100, message: 'Missing required fields' });
    }
                
    try{
        const [reservation] = await db.execute("SELECT RESID FROM HXY_RESERVATION WHERE RESID = ?", [reservationID]);
        if(reservation.length === 0){
            return res.status(400).json({success: false, code: 102, message: 'reservation not found'});
        }
        await db.execute("UPDATE HXY_RESERVATION SET ISACTIVE = 0 WHERE RESID", [reservationID]);
        res.status(200).json({
            success: true,
            message: "reservation cancelled"
        });
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}


module.exports = {
    getAllReservations,
    getById,
    getReservation,
    makeReservation,
    myReservation,
    cancelReservation
}