//importing packages
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config();


//importing routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require("./routes/bookRoutes");
const topicRoutes = require("./routes/topicRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authorRoutes = require("./routes/authorRoutes")
const eventRoutes = require("./routes/eventRoutes");
const sponsorRoutes = require("./routes/sponsorRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const customerRoutes = require("./routes/customerRoutes");

//start an express app
const app = express()
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(cors());

//application routers
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/topics', topicRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);


//port setting
const port = 3000
app.listen(port, () =>{
   console.log(`Example app listening on port ${port}`)
})