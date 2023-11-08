const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",

    user: "root",

    database: "employee_tracker",
});

db.on("error", (err) => {
    console.log("- STATS Mysql2 connection died:", err);
});

module.exports = db;