var mysql = require('mysql');

var database = "w2NUkoaNPK"

var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "w2NUkoaNPK",
    password: "20mBA2bR4T",
    database: database
});


con.connect(function (err){
    if(err) throw console.log(err);
    else console.log("Database Status : Connected\nDatabase Name : " + database)
});

module.exports = con;