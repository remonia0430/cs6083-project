const db = require("../config/DBconfig");
const { get } = require("../routes/bookRoutes");

const getAllPayments = async (req, res) => {
    const sdate = req.query.sdate;
    const edate = req.query.edate;

    let sql = `SELECT P.PAYID as PaymentId,
                        P.PAYDATE as PayDate,
                        P.METHOD as Method,
                        P.PAYAMOUNT as Amount,
                        P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        case
                            when P.METHOD = 'Credit' then CONCAT(P.CFNAME, ' ', P.CLNAME)
                            else null
                        end as CreditCardName,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO`

    if(sdate && !edate) {
        sql += ` WHERE P.PAYDATE = '${sdate}'`;
    }
    else if(sdate && edate) {
        sql += ` WHERE P.PAYDATE BETWEEN '${sdate}' AND '${edate}'`;
    }

    try {
        const [payments] = await db.execute(sql);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getById = async (req, res) => {
    const sql = `SELECT P.PAYID as PaymentId,
                        P.PAYDATE as PayDate,
                        P.METHOD as Method,
                        P.PAYAMOUNT as Amount,
                        P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        case
                            when P.METHOD = 'Credit' then CONCAT(P.CFNAME, ' ', P.CLNAME)
                            else null
                        end as CreditCardName,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE P.PAYID = ?;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [payments] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getByInvoiceId = async (req, res) => {
    const sql = `SELECT P.PAYID as PaymentId,
                        P.PAYDATE as PayDate,
                        P.METHOD as Method,
                        P.PAYAMOUNT as PaidAmount,
                        P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        case
                            when P.METHOD = 'Credit' then CONCAT(P.CFNAME, ' ', P.CLNAME)
                            else null
                        end as CreditCardName,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE P.RENTID = ?;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [payments] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getByCustomerId = async (req, res) => {
    const sql = `SELECT P.PAYID as PaymentId,
                        P.PAYDATE as PayDate,
                        P.METHOD as Method,
                        P.PAYAMOUNT as Amount,
                        P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        case
                            when P.METHOD = 'Credit' then CONCAT(P.CFNAME, ' ', P.CLNAME)
                            else null
                        end as CreditCardName,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [payments] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}


const myPayment = async (req, res) => {
    const sql = `SELECT P.PAYID as PaymentId,
                        P.PAYDATE as PayDate,
                        P.METHOD as Method,
                        P.PAYAMOUNT as Amount,
                        P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        case
                            when P.METHOD = 'Credit' then CONCAT(P.CFNAME, ' ', P.CLNAME)
                            else null
                        end as CreditCardName,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?;`
    const id = req.user.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [payments] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}


const makePayment = async (req, res) => {
    const sql = `INSERT INTO HXY_PAYMENT (PAYDATE, METHOD, PAYAMOUNT, RENTID, CFNAME, CLNAME)
                VALUES (?, ?, ?, ?, ?, ?);`
    const { method, amount, rentId, fname, lname } = req.body;
    const payDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // if (!method || !amount || !rentId) return res.status(400).json({ success: false, message: 'missing fields' });
    if(!method) return res.status(400).json({ success: false, code: 100, message: 'missing payment method' });
    if (amount === null) return res.status(400).json({ success: false, code: 100, message: 'missing payment amount' });
    if (!rentId) return res.status(400).json({ success: false, code: 100, message: 'missing rent id' });
    if (method === 'Credit' && (!fname || !lname)) return res.status(400).json({ success: false, code: 100, message: 'missing card holder name' });
    
    try {
        if(method === 'Credit') {
            await db.execute(sql, [payDate, method, amount, rentId, fname, lname]);
        }
        else{
            await db.execute(sql, [payDate, method, amount, rentId, null, null]);
        }

        res.status(200).json({ success: true, message: "ok" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

module.exports = {
    getAllPayments,
    getById,
    getByInvoiceId,
    getByCustomerId,
    makePayment,
    myPayment
}