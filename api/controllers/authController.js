const db = require("../config/DBconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;

    const sql = `SELECT * FROM HXY_CUSTOMER WHERE USERNAME = ?`;
    const [rows] = await db.execute(sql, [username]);

    if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.PASSWD);

    if (!match) {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign(
        { id: user.CUSTNO, isAdmin: user.ISADMIN === 1 },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '2h' }
    );

    res.json({ success: true, token });
};


const register = async (req, res) => {
    const {fname, lname, phone, email, idtype, idno, username, passwd} = req.body;
    if(!fname || !lname || !phone || !email || !idtype || !idno || !username || !passwd){
        return res.status(400).json({success: false, message: "missing fields"});
    }
    
    try{
        const [user] = await db.execute("SELECT IS_ADMIN FROM HXY_CUSTOMER WHERE USERNAME = ?", [username]);
        if(user.length > 0){
            return res.status(400).json({success: false, message: `User ${username} already exists`});
        }

        const hashedPW = await bcrypt.hash(passwd, 10);
        await db.execute(`INSERT INTO HXY_CUSTOMER (CFNAME, CLNAME, PHONE, EMAIL, IDTYPE, IDNO, IS_ADMIN, USERNAME, PASSWD)
                    VALUES(?, ?, ?, ?, ?, ?, 0, ?, ?)`, [fname, lname, phone, email, idtype, idno, username, hashedPW]);

        return res.status(200).json({success: true, message: `Register successful`});
    }
    catch(err){
        console.err(err);
        res.status(500).json({success: false, message: `Error`});
    }
}

const setAdmin = async (req, res) => {
    const { isAdmin, id } = req.body;
    if (!id || isAdmin === undefined){
        return res.status(400).json({ success: false, message: 'missing fields' });
    }

    try {
        const sql = `UPDATE HXY_CUSTOMER SET IS_ADMIN = ? WHERE CUSTNO = ?`;
        await db.execute(sql, [isAdmin, id]);

        if(isAdmin === 0){
            return res.status(200).json({ success: true, message: `User ${id} is no longer an admin` });
        }
        else{
            return res.status(200).json({ success: true, message: `User ${id} is now an admin` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}

module.exports = {
    login,
    register,
    setAdmin
}