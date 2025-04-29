// const db = require("../config/DBconfig");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const login = async (req, res) =>{
//     const {username, password} = req.body;

//     if(!username || !password){
//         return res.status(400).json({success: false, message: "username and password required"});
//     }

//     try{
//         const user = await db.execute("SELECT PASSWD as password, IS_ADMIN as role FROM HXY_CUSTOMER WHERE USERNAME = ?", [username]);
//         if(!user){
//             return res.status(400).json({success: false, message: `User ${username} doesn't exist`});
//         }

//         const match = await bcrypt.match(password, user.password);
//         if(!match){
//             return res.status(400).json({success: false, message: `Wrong password`});
//         }

//         const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });

//         return res.status(200).json({success: true, message: `Login successful`, role: user.role});
//     }
//     catch(err){
//         console.err(err);
//         res.status(500).json({success: false, message: `Error`});
//     }

// }

// const register = async (req, res) => {
//     const {fname, lname, phone, email, idtype, idno, username, passwd} = req.body;
//     if(!fname || !lname || !phone || !email || !idtype || !idno || !username || !passwd){
//         return res.status(400).json({success: false, message: "username and password required"});
//     }
    
//     try{
//         const user = await db.execute("SELECT IS_ADMIN FROM HXY_CUSTOMER WHERE USERNAME = ?", [username]);
//         if(user){
//             return res.status(400).json({success: false, message: `User ${username} already exists`});
//         }

//         const hashedPW = bcrypt.hash(passwd, 10);
//         db.execute(`INSERT INTO HXY_CUSTOMER (CFNAME, CLNAME, PHONE, EMAIL, IDTYPE, IDNO, IS_ADMIN, USERNAME, PASSWD
//                     VALUES(?, ?, ?, ?, ?, ?, 0, ?, ?,)`, [fname, lname, phone, email, idtype, idno, username, hashedPW]);

//         return res.status(200).json({success: true, message: `Register successful`});
//     }
//     catch(err){
//         console.err(err);
//         res.status(500).json({success: false, message: `Error`});
//     }
// }
