const db = require("../config/DBconfig");

const getAllSponsors = async(req, res) => {
    const sql = `SELECT S.SPONSORNO as SponsorNo,
                        S.STYPE as SponsorType,
                        CASE 
                            WHEN S.STYPE = 'HXY_ORGANIZATION' THEN O.ONAME
                            WHEN S.STYPE = 'HXY_INDIVIDUAL' THEN CONCAT(I.SFNAME, ' ', I.SLNAME)
                        END AS SponsorName
                FROM HXY_SPONSOR S
                LEFT JOIN HXY_ORGANIZATION O ON O.SPONSORNO = S.SPONSORNO
                LEFT JOIN HXY_INDIVIDUAL I ON I.SPONSORNO = S.SPONSORNO;`

    try{
        const [sponsors] = await db.execute(sql);

        res.status(200).json({success: true, message:"ok", sponsors});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async(req, res) => {
    const sql = `SELECT S.SPONSORNO as SponsorNo,
                        S.STYPE as SponsorType,
                        CASE 
                            WHEN S.STYPE = 'HXY_ORGANIZATION' THEN O.ONAME
                            WHEN S.STYPE = 'HXY_INDIVIDUAL' THEN CONCAT(I.SFNAME, ' ', I.SLNAME)
                            ELSE NULL
                        END AS SponsorName
                FROM HXY_SPONSOR S
                LEFT JOIN HXY_ORGANIZATION O ON O.SPONSORNO = S.SPONSORNO
                left JOIN HXY_INDIVIDUAL I ON I.SPONSORNO = S.SPONSORNO
                where S.SPONSORNO = ?;`
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{
        const [sponsors] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", sponsors});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addSponsor = async(req, res) => {
    const sql = `INSERT INTO HXY_SPONSOR (STYPE) VALUES (?)`;
    const {sponsorType , fname, lname} = req.body;

    if(!sponsorType || !fname) res.status(400).json({success: false, code: 100, message: 'missing fields'});
    if(sponsorType !== 'HXY_ORGANIZATION' && sponsorType !== 'HXY_INDIVIDUAL') res.status(400).json({success: false, message: 'invalid sponsor type'});
    if(sponsorType === 'HXY_INDIVIDUAL' && !lname) res.status(400).json({success: false, code: 100, message: 'missing individual name'});

    const conn = await db.getConnection();
    try{
        const [sponsor] = await conn.execute(sql, [sponsorType]);
        const id = sponsor.insertId;
        
        if(sponsorType === 'HXY_ORGANIZATION'){
            const orgSQL = `INSERT INTO HXY_ORGANIZATION (SPONSORNO, ONAME) VALUES (?, ?)`;
            await conn.execute(orgSQL, [id, fname]);
        }
        else{
            const indSQL = `INSERT INTO HXY_INDIVIDUAL (SPONSORNO, SFNAME, SLNAME) VALUES (?, ?, ?)`;
            await conn.execute(indSQL, [id, fname, lname]);
        }

        res.status(200).json({success: true, message:"ok"});
    }
    catch(err){
        conn.rollback();
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const delSponsor = async(req, res) => {
    const sql = `DELETE FROM HXY_SPONSOR WHERE SPONSORNO = ?`;
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'}); 
    try{
        await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

module.exports = {
    getAllSponsors,
    getById,
    addSponsor,
    delSponsor
};