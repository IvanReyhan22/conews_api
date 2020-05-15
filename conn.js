var mysql = require('mysql');

var database = "w2NUkoaNPK"

var db_config = {
    host: "remotemysql.com",
    user: "w2NUkoaNPK",
    password: "20mBA2bR4T",
    database: database
}

var connection = mysql.createPool(db_config)

module.exports = connection