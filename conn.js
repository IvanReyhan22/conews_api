var mysql = require('mysql');

var database = "w2NUkoaNPK"

var db_config = {
    host: "remotemysql.com",
    user: "w2NUkoaNPK",
    password: "20mBA2bR4T",
    database: database
}

// var con = mysql.createConnection({
//     host: "remotemysql.com",
//     user: "w2NUkoaNPK",
//     password: "20mBA2bR4T",
//     database: database
// });

var connection;

function handleDisconnect() {

    connection = mysql.createConnection(db_config);

    connection.connect(function (err) {

        if (err) {
            console.log('error when connecting to database: ', err)
            setTimeout(handleDisconnect, 2000)
        }

    })

    connection.on('error', function (err) {

        console.log('db error ', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {

            handleDisconnect();

        } else {

            throw err;

        }

    });

}

handleDisconnect()

// con.connect(function (err) {
//     if (err) throw console.log(err);
//     else console.log("Database Status : Connected\nDatabase Name : " + database)
// });

module.exports = connection;