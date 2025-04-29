var mysql = require('mysql2/promise');

const db = mysql.createPool({
		host: "csgy-6083-project.cmpmkwkw2dmw.us-east-1.rds.amazonaws.com",
		user: "admin",
		password: "cs6083project",
		database: "test"
	}
);

module.exports = db;