var mysql = require('mysql');

var database = "conews"

var con = mysql.createConnection({
    host: "www.db4free.net",
    user: "conews",
    password: "conews1234567890",
    database: database
});

con.connect(function (err){
    if(err) throw console.log(err);
    else console.log("Database Status : Connected\nDatabase Name : " + database)
});

module.exports = con;