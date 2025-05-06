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

    res.status(200).json({ success: true, token });
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

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, code: 100, message: 'email required' });
    }

    const sql = `SELECT CUSTNO FROM HXY_CUSTOMER WHERE EMAIL = ?;`

    try {
        const [rows] = await db.execute(sql, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, code: 102, message: 'User not found' });
        }

        const user = rows[0];
        const generateToken = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let token = '';
            for (let i = 0; i < 6; i++) {
              token += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return token;
          };
          
        const token = generateToken();
                  
        const hashedToken = await bcrypt.hash(token, 10);
        const expiration = Date.now() + 3600000; // 1 hour
        const sqlInsert = `UPDATE HXY_CUSTOMER SET TOKEN = ?, EXPIRATION = ? WHERE CUSTNO = ?;`
        await db.execute(sqlInsert, [hashedToken, expiration, user.CUSTNO]);
        
        const sender = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "hxyproject666@gmail.com",
                pass: "ngjawkdhawlrdzys"
            }
        });

        await sender.sendMail({
            from: "hxyproject666@gmail.com",
            to: email,  
            subject: "Password Reset",
            text: `Your password reset token is: ${token}. It will expire in 1 hour.`
        });
        
        return res.status(200).json({ success: true, message: `Password reset link sent to ${email}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}

const verifyPasswordResetToken = async (req, res) => {
    const { email, token } = req.body;

    if (!token || !email) {
        return res.status(400).json({ success: false, code: 100, message: 'missing fields' });
    }

    try {
        // Check if user exists
        const sql = `SELECT CUSTNO, TOKEN, EXPIRATION FROM HXY_CUSTOMER WHERE EMAIL = ?;`
        const [rows] = await db.execute(sql, [email]);
        const user = rows[0];
        if (rows.length === 0) {
            return res.status(404).json({ success: false, code: 102, message: 'User not found' });
        }

        if( Date.now() > rows[0].EXPIRATION) {
            return res.status(400).json({ success: false, code: 103, message: 'Token expired' });
        }
        else{
            const match = await bcrypt.compare(token, rows[0].TOKEN);

            if (!match) {
                return res.status(401).json({ success: false, code: 104, message: 'Invalid token' });
            }
        }
        
        const t = jwt.sign(
            { id: user.CUSTNO, isAdmin: user.ISADMIN === 1 },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '2h' }
        );    

        return res.status(200).json({ success: true, message: `Token is valid`, token: t });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const id = req.user.id;

    if (!newPassword) {
        return res.status(400).json({ success: false, code: 100, message: 'newPassword required' });
    }

    const sql = `SELECT PASSWD FROM HXY_CUSTOMER WHERE CUSTNO = ?;`

    try {
        const [rows] = await db.execute(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, code: 102, message: 'User not found' });
        }

        const user = rows[0];

        const hashedPW = await bcrypt.hash(newPassword, 10);
        await db.execute(`UPDATE HXY_CUSTOMER SET PASSWD = ? WHERE CUSTNO = ?`, [hashedPW, id]);

        return res.status(200).json({ success: true, message: `Update successful` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}


module.exports = {
    login,
    register,
    setAdmin,
    requestPasswordReset,
    verifyPasswordResetToken,
    resetPassword
}