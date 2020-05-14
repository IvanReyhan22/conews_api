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
            setTimeout(handleDisconnect, 3000)
        }

    })

    connection.on('error', function (err) {

        console.log('db error ' + err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST') {

            console.log("reconnection to db....")
            handleDisconnect();

        } else {

            throw err;

        }

    });

}

handleDisconnect()

module.exports = connection;