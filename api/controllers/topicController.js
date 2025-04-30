const db = require("../config/DBconfig");

const getAllTopics = async(req, res) => {
    const sql = "SELECT * FROM HXY_TOPIC";

    try{
        const [topics] = await db.execute(sql);

        res.status(200).json({success: true, message:"ok", topics});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async(req, res) => {
    const sql = "SELECT * FROM HXY_TOPIC WHERE TOPICID = ?";
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, message: 'id required'});

    try{
        const [topics] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", topics});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getByName = async(req, res) => {
    const sql = "SELECT * FROM HXY_TOPIC WHERE TNAME LIKE ?";
    const name = req.query.name;

    if(!name) res.status(400).json({success: false, message: 'topic name required'});

    try{
        const [topics] = await db.execute(sql, [`%${name}%`]);

        res.status(200).json({success: true, message:"ok", topics});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addTopic = async(req, res) =>{
    const {tname} = req.body;
    if(!tname) res.status(400).json({success: false, message: 'topic name required'});
    
    try{
        const testSQL = "SELECT * FROM HXY_TOPIC WHERE TNAME = ?";
        const [test] = await db.execute(testSQL, [tname]);
        if(test.length !== 0){
            return res.status(400).json({success: false, message: 'topic already exists'});
        }

        const addSQL = "INSERT INTO HXY_TOPIC(TNAME) VALUE(?)";
        await db.execute(addSQL, [tname]);

        res.status(200).json({success: true, message: "Topic added"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const delTopic = async(req, res) =>{
    const sql = "SELECT * FROM HXY_TOPIC WHERE TOPICID = ?";
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, message: 'id required'});

    try{

        const del = "UPDATE HXY_TOPIC SET ISDELETED = 1 WHERE TOPICID = ?"
        const [topics] = await db.execute(del, [id]);

        res.status(200).json({success: true, message:"topic deleted"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

module.exports = {
    getAllTopics,
    getByName,
    getById,
    addTopic,
    delTopic
}