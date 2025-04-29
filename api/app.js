const express = require('express')
var bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

const port = 3000

const configs = require("./config")
app.get('/', (req, res) =>{
   res.send('Hello world')
})


//import mysql
var mysql = require('mysql')
//create database connection
var connection = mysql.createConnection(configs.mysql)

//connect database
connection.connect()
connection.query("SELECT * FROM HXY_AUTHOR AS solution", function(err, rows, fields){
   if(err) throw err
   console.log("Result: ", rows[0].solution)
})

app.listen(port, () =>{
   console.log(`Example app listening on port ${port}`)
})