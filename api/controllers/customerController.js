const db = require("../config/DBconfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const myProfile = async (req, res) => {
    const sql = `SELECT C.USERNAME as Username,
                        C.CUSTNO as CustomerNo,
                        C.CFNAME as FirstName,
                        C.CLNAME as LastName,
                        C.PHONE as Phone,
                        C.EMAIL as Email,
                        C.IDTYPE as ID
                FROM HXY_CUSTOMER C
                WHERE C.CUSTNO = ?;`
    const id = 1;

    try {
        const [customer] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", customer });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getById = async (req, res) => {
    const sql = `SELECT C.CUSTNO as CustomerNo,
                        C.USERNAME as Username
                FROM HXY_CUSTOMER C
                WHERE C.CUSTNO = ?;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [customer] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", customer });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getInfoById = async (req, res) => {
    const sql = `SELECT C.CUSTNO as CustomerNo,
                        C.USERNAME as Username,
                        C.CFNAME as FirstName,
                        C.CLNAME as LastName,
                        C.PHONE as Phone,
                        C.EMAIL as Email,
                        C.IDTYPE as ID,
                        C.IDNO as IDNo,
                        C.IS_ADMIN as IsAdmin
                FROM HXY_CUSTOMER C
                WHERE C.CUSTNO = ?;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [customer] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", customer });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const updateProfile = async (req, res) => {
    const { fname, lname, phone, email, idType, idno } = req.body;
    const id = req.user.id;
    let sql = `UPDATE HXY_CUSTOMER SET CUSTNO = ?`;
    let params = [id];
    if (fname) {
        sql += `, CFNAME = ?`;
        params.push(fname);
    }
    if (lname) {
        sql += `, CLNAME = ?`;
        params.push(lname);
    }
    if (phone) {
        sql += `, PHONE = ?`;
        params.push(phone);
    }
    if (email) {
        sql += `, EMAIL = ?`;
        params.push(email);
    }
    if (idType) {
        sql += `, IDTYPE = ?`;
        params.push(idType);
    }
    if (idno) {
        sql += `, IDNO = ?`;
        params.push(idno);
    }

    if(params.length === 1) {
        return res.status(400).json({ success: false, code: 100, message: 'No fields to update' });
    }

    sql += ` WHERE CUSTNO = ?`;
    params.push(id);

    try {
        console.log(sql);
        await db.execute(sql, params);

        return res.status(200).json({ success: true, message: `Update successful` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}

const resetPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, code: 100, message: 'oldPassword and newPassword required' });
    }

    const sql = `SELECT PASSWD FROM HXY_CUSTOMER WHERE CUSTNO = ?;`

    try {
        const [rows] = await db.execute(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, code: 102, message: 'User not found' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(oldPassword, user.PASSWD);

        if (!match) {
            return res.status(401).json({ success: false, code: 104, message: 'Incorrect password' });
        }

        const hashedPW = await bcrypt.hash(newPassword, 10);
        await db.execute(`UPDATE HXY_CUSTOMER SET PASSWD = ? WHERE CUSTNO = ?`, [hashedPW, id]);

        return res.status(200).json({ success: true, message: `Update successful` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: `Error` });
    }
}

const getAllCustomers = async (req, res) => {
    const sql = `SELECT * FROM HXY_CUSTOMER C;`

    try {
        const [customers] = await db.execute(sql);

        res.status(200).json({ success: true, message: "ok", customers });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

module.exports = {
    myProfile,
    getById,
    getInfoById,
    updateProfile,
    resetPassword,
    getAllCustomers
}