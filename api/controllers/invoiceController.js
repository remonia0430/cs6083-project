const db = require("../config/DBconfig");

const getAllInvoices = async (req, res) => {
    const sql = `SELECT I.RENTID as RENTID,
                        I.INVDATE as InvoiceDate,
                        I.INVAMOUNT as Amount,
                        C.CUSTNO as CustomerNo,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName
                FROM HXY_INVOICE I
                left JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO;`

    try {
        const [invoices] = await db.execute(sql);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getById = async (req, res) => {
    const sql = `SELECT I.RENTID as RENTNo,
                        I.INVDATE as InvoiceDate,
                        I.INVAMOUNT as Amount,
                        C.CUSTNO as CustomerNo,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName,
                        SUM(P.PAYAMOUNT) as PaidAmount,
                        I.INVAMOUNT - SUM(P.PAYAMOUNT) as RemainingAmount,
                        SUM(P.PAYAMOUNT) = I.INVAMOUNT as IsPaid
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                left JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE I.RENTID = ?
                GROUP BY I.RENTID;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [invoices] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getByCustomerId = async (req, res) => {
    const sql = `SELECT I.RENTID as RENTNo,
                        I.INVDATE as InvoiceDate,
                        I.INVAMOUNT as Amount,
                        C.CUSTNO as CustomerNo,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName,
                        SUM(P.PAYAMOUNT) as PaidAmount,
                        I.INVAMOUNT - SUM(P.PAYAMOUNT) as RemainingAmount,
                        SUM(P.PAYAMOUNT) = I.INVAMOUNT as IsPaid
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                left JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?
                GROUP BY I.RENTID;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [invoices] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getMyInvoices = async (req, res) => {
    const sql = `SELECT I.RENTID as RENTNo,
                        I.INVDATE as InvoiceDate,
                        I.INVAMOUNT as Amount,
                        C.CUSTNO as CustomerNo,
                        CONCAT(C.CFNAME, ' ', C.CLNAME) as CustomerName,
                        SUM(P.PAYAMOUNT) as PaidAmount,
                        I.INVAMOUNT - SUM(P.PAYAMOUNT) as RemainingAmount,
                        SUM(P.PAYAMOUNT) = I.INVAMOUNT as IsPaid
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                left JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?
                GROUP BY I.RENTID;`
    const id = req.user.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [invoices] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}


const getInvoiceStatus = async (req, res) => {
    const sql = `SELECT P.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        SUM(P.PAYAMOUNT) as PaidAmount,
                        I.INVAMOUNT as InvoiceAmount,
                        SUM(P.PAYAMOUNT) = I.INVAMOUNT as IsPaid,
                        SUM(P.PAYAMOUNT) - I.INVAMOUNT as RemainingAmount
                FROM HXY_PAYMENT P
                LEFT JOIN HXY_RENTAL R ON R.RENTID = P.RENTID
                LEFT JOIN HXY_INVOICE I ON I.RENTID = P.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?;`
    const id = req.query.rentId;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'rentId required' });

    try {
        const [payments] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", payments });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getCustomerUnpaidInvoices = async (req, res) => {
    const sql = `SELECT I.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        I.INVAMOUNT as InvoiceAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then 0
                            else SUM(P.PAYAMOUNT)
                        end as PaidAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then I.INVAMOUNT
                            else I.INVAMOUNT - SUM(P.PAYAMOUNT)
                        end as RemainingAmount
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                LEFT JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?
                GROUP BY I.RENTID;`
    const id = req.query.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [invoices] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getMyUnpaidInvoices = async (req, res) => {
    const sql = `SELECT I.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        I.INVAMOUNT as InvoiceAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then 0
                            else SUM(P.PAYAMOUNT)
                        end as PaidAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then I.INVAMOUNT
                            else I.INVAMOUNT - SUM(P.PAYAMOUNT)
                        end as RemainingAmount
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                LEFT JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                WHERE C.CUSTNO = ?
                GROUP BY I.RENTID
                HAVING RemainingAmount > 0;`
    const id = req.user.id;

    if (!id) return res.status(400).json({ success: false, code: 100, message: 'id required' });

    try {
        const [invoices] = await db.execute(sql, [id]);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

const getUnpaidInvoices = async (req, res) => {
    const sql = `SELECT I.RENTID as RentNo,
                        C.CUSTNO as CustomerNo,
                        I.INVAMOUNT as InvoiceAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then 0
                            else SUM(P.PAYAMOUNT)
                        end as PaidAmount,
                        case
                            when SUM(P.PAYAMOUNT) is null then I.INVAMOUNT
                            else I.INVAMOUNT - SUM(P.PAYAMOUNT)
                        end as RemainingAmount
                FROM HXY_INVOICE I
                LEFT JOIN HXY_PAYMENT P ON P.RENTID = I.RENTID
                LEFT JOIN HXY_RENTAL R ON R.RENTID = I.RENTID
                LEFT JOIN HXY_CUSTOMER C ON C.CUSTNO = R.CUSTNO
                GROUP BY I.RENTID, C.CUSTNO, I.INVAMOUNT
                HAVING ROUND(I.INVAMOUNT - COALESCE(SUM(P.PAYAMOUNT), 0), 2) > 0;`

    try {
        const [invoices] = await db.execute(sql);

        res.status(200).json({ success: true, message: "ok", invoices });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'error' });
    }
}

module.exports = {  
    getAllInvoices,
    getById,
    getByCustomerId,
    getInvoiceStatus,
    getCustomerUnpaidInvoices,
    getUnpaidInvoices,
    getMyInvoices,
    getMyUnpaidInvoices
};