const db = require("../config/DBconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    getAllCustomers
}