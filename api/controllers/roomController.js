const db = require("../config/DBconfig");

const getAllRooms = async(req, res) => {
    const sql = "SELECT * FROM HXY_ROOM";

    try{
        const [rooms] = await db.execute(sql);

        res.status(200).json({success: true, message:"ok", rooms});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async(req, res) => {
    const sql = "SELECT * FROM HXY_ROOM WHERE ROOMNO = ?";
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{
        const [rooms] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", rooms});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getAvailableSlots = async (req, res) => {
    const { roomID, date } = req.query;
  
    if (!roomID || !date) {
      return res.status(400).json({ success: false, code: 100, message: 'roomID and date required' });
    }
  
    const sql = `SELECT STARTTIME, ENDTIME
                    FROM HXY_RESERVATION
                    WHERE ROOMNO = ? AND RESDATE = ?;`;
  
    try {
        const [reservations] = await db.execute(sql, [roomID, date]);
            
        const allSlots = [];
        for (let hour = 8; hour < 22; hour++) {
          const start = `${hour.toString().padStart(2, '0')}:00`;
          const end = `${(hour + 1).toString().padStart(2, '0')}:00`;
          allSlots.push({ start, end });
        }
    
        const availableSlots = allSlots.filter(slot => {
            return !reservations.some(resv => {
                return (
                    slot.start < resv.ENDTIME &&
                    slot.end > resv.STARTTIME
                );
            });
        });
    
        res.json({ success: true, availableSlots });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'error' });
    }
}

const addRoom = async(req, res) =>{
    const {roomNO, capacity} = req.body;
    if(!capacity || !roomNO) res.status(400).json({success: false, code: 100, message: 'room capacity and roomNo required'});
    
    try{
        const addSQL = "INSERT INTO HXY_ROOM(ROOMNO, CAPACITY) VALUE(?, ?)";
        await db.execute(addSQL, [roomNO, capacity]);

        res.status(200).json({success: true, message: "Room added"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const delRoom = async(req, res) =>{
    const sql = "SELECT * FROM HXY_ROOM WHERE ROOMNO = ?";
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{

        const del = "UPDATE HXY_ROOM SET ISDELETED = 1 WHERE ROOMNO = ?"
        const [rooms] = await db.execute(del, [id]);

        res.status(200).json({success: true, message:"room deleted"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

module.exports = {
    getAllRooms,
    getById,
    addRoom,
    delRoom,
    getAvailableSlots
}