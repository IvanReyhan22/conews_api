'use strict';

const crypto = require('crypto')
const multer = require('multer')
const path = require('path')

var response = require('./res');
var conn = require('./conn');

//
// Upload Image 
// 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/storage/')
    },
    filename: (req, file, cb) => {
        // cb(null, file.filename + '-' +Date.now() + path.extname(file.originalname))
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single("article_image");

//
// create user
// 
exports.createUser = function (req, res) {

    var username = req.body.username
    var phone = req.body.phone
    var email = req.body.email
    var password = md5(req.body.password)

    conn.query('SELECT * FROM tb_user WHERE email = ? OR username = ?',
        [email, username]
        , function (error, rows, fields) {
            if (error) throw response.err("Request timed out / No internet access")

            if (rows.length == 0) {

                conn.query('INSERT INTO tb_user (username, email, password, phone) VALUES (?,?,?,?)',
                    [username, email, password, phone]
                    , function (error, rows, fields) {

                        if (error) throw response.err("Connection timed out / no Internet connection", res);

                        conn.query('SELECT * FROM tb_user WHERE user_id = ?',
                            [rows.insertId]
                            , function (error, rows, fields) {

                                if (error) throw response.err("Connection timed out / no Internet connection", res)

                                if (rows) {

                                    res.json(rows[0])
                                    res.end()

                                }

                            });

                    });

            } else {

                response.err("Email / Username is already taken!", res)

            }

        })

};

//
// login user
//
exports.loginUser = function (req, res) {

    var eml = req.body.eml
    var pass = md5(req.body.pass)

    conn.query('SELECT * FROM tb_user WHERE email = ?',
        [eml]
        , function (error, rows, fields) {
            if (error) throw response.err("Request Timed Out / No Internet Access", res)

            if (rows.length != 0) {

                if (rows[0].password == pass) {
                    res.json(rows[0])
                    res.end()
                }

                else { response.err("Password incorrect", res) }

            } else {
                response.err("User not registered", res)
            }
        });

}

/**
 * get article
 */
exports.article = function (req, res) {

    conn.query('SELECT * FROM tb_article', function (error, rows, fields) {
        if (error) {
            console.log(error)
        } else {
            res.json(rows)
            res.end()
        }
    });
};

/**
 * create Article
 */
exports.createArticle = function (req, res) {

    upload(req, res, err => {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();

        var Month = ["Januari", "Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        var dateTimeStamp = Month[mm] + ' ' + dd.toString();
        // var dateTimeStamp =  mm.toString() + '-' + dd.toString() + '-' + yyyy.toString();

        var title = req.body.title
        var article_image = req.file.filename
        var date = dateTimeStamp
        var description = req.body.description
        var category = req.body.category === undefined ? "daily" : req.body.category

        conn.query('INSERT INTO tb_article (image,title,date,description,category) VALUES (?,?,?,?,?)',
            [article_image,title,date,description,category]
            , function (error, rows, fields) {

                if (error) response.err("Failed create article " + error, res)

                if (rows.affectedRows && rows.insertId) {

                    response.ok("Success create article", res)
                }

            })

        // var owner_id = req.body.owner_id
        // var profileimage = req.file.filename
        // var title = req.body.title
        // var description = req.body.description
        // var requirement = req.body.requirement
        // var deadline = req.body.deadline
        // var budget = req.body.budget
        // var salary = req.body.salary
        // var additional_files = req.body.additional_files
        // var categories = req.body.categories
        // var location = req.body.location

        // conn.query('INSERT INTO tb_job (`owner_id`, `status`, `jobimage`, `title`, `description`, `requirement`, `deadline`, `budget`, `salary`, `additional_files`, `categories`, `location`, `date`, `freelancers_binding`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        //     [owner_id,1,profileimage,title,description,requirement,deadline,budget,salary,additional_files,categories,location,date,0]
        // ,function (error, rows, fields){

        //     if ( error ) response.err("Failed create job " + error, res)

        //     if ( rows.affectedRows && rows.insertId ) {

        //         response.ok("Success create new job",res)
        //     }


        // })

    })
}

// 
// index
// 
exports.index = function (req, res) {
    response.ok("Conews Api v.1.1 by Ivan Reyhan", res)
};

/**
 * encription
 */
function md5(data) {
    // return data
    return crypto.createHash('md5').update(data).digest('hex')
}