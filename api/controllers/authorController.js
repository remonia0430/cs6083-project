const db = require("../config/DBconfig");

const getAllAuthors = async(req, res) => {
    const sql = "SELECT AUTHNO, CONCAT(AFNAME, ' ', ALNAME) AS NAME FROM HXY_AUTHOR";

    try{
        const [authors] = await db.execute(sql);

        res.status(200).json({success: true, message:"ok", authors});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const getById = async(req, res) => {
    const sql = "SELECT * FROM HXY_AUTHOR WHERE AUTHNO = ?";
    const id = req.query.id;

    if(!id) res.status(400).json({success: false, code: 100, message: 'id required'});

    try{
        const [authors] = await db.execute(sql, [id]);

        res.status(200).json({success: true, message:"ok", authors});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }
}

const addAuthor = async(req, res) =>{
    const {fname, lname, street, city, zipcode, email} = req.body;
    if(!fname || !lname || !street || !city || !zipcode || !email) res.status(400).json({success: false, code: 100, message: 'missing fields'});
    
    try{
        const checkSQL = "SELECT AUTHNO FROM HXY_AUTHOR WHERE AFNAME = ? AND ALNAME = ?";
        const [check] = await db.execute(checkSQL, [fname, lname]);

        if(check.length !== 0){
            return res.status(400).json({success: false, code: 101, message:"author already exists"});
        }

        const addSQL = "INSERT INTO HXY_AUTHOR(AFNAME, ALNAME, STREET, CITY, ZIPCODE, EMAIL) VALUE(?, ?, ?, ?, ?, ?)";
        await db.execute(addSQL, [fname, lname, street, city, zipcode, email]);

        res.status(200).json({success: true, message: "AUTHOR added"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}

const updateAuthor = async (req, res) => {
    const authno = req.query.id;
	if(!authno) res.status(400).json({success: false, code: 100, message: 'id required'});

    const {fname, lname, street, city, zipcode, email} = req.body;
  
    const fields = [];
    const values = [];
  
    if (fname !== undefined) {
		fields.push("AFNAME = ?");
		values.push(fname);
    }
    if (lname !== undefined) {
		fields.push("ALNAME = ?");
		values.push(lname);
    }
    if (street !== undefined) {
		fields.push("STREET = ?");
		values.push(street);
    }
    if (city !== undefined) {
		fields.push("CITY = ?");
		values.push(city);
    }
    if (zipcode !== undefined) {
		fields.push("ZIPCODE = ?");
		values.push(zipcode);
    }
    if (email !== undefined) {
		fields.push("EMAIL = ?");
		values.push(email);
    }
  
    if (fields.length === 0) {
		return res.status(400).json({
			success: false,
			message: "No fields provided for update."
		});
    }
  
    const sql = `UPDATE HXY_AUTHOR SET ${fields.join(', ')} WHERE AUTHNO = ?`;
    values.push(authno); 
    try {
        const [result] = await db.execute(sql, values);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Author not found." });
        }
    
        res.json({ success: true, message: "Author updated successfully." });
    } 
    catch (err) {
        console.error("Error updating author:", err);
        res.status(500).json({ success: false, message: "Database error." });
    }
  };
  

const delAuthor = async(req, res) =>{
    const id = req.query.id;

    if(!id) return res.status(400).json({success: false, code: 100, message: 'id required'});

    try{

        const del = "UPDATE HXY_AUTHOR SET ISDELETED = 1 WHERE AUTHNO = ? and ISDELETED = 0;"
        const [authors] = await db.execute(del, [id]);

		if (authors.affectedRows === 0) {
			return res.status(400).json({ success: false, code: 102, message: "Author not found." });
		}

        res.status(200).json({success: true, message:"author deleted"});
    }
    catch(err){
        console.error(err);
        return res.status(500).json({success: false, message: 'error'});
    }

}
    

module.exports = {
    getAllAuthors,
    getById,
    addAuthor,
    updateAuthor,
    delAuthor
}