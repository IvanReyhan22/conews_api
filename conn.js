var mysql = require('mysql');

var database = "conews"

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: database
});

con.connect(function (err){
    if(err) throw console.log(err);
    else console.log("Database Status : Connected\nDatabase Name : " + database)
});

module.exports = con;