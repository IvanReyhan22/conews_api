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

    conn.getConnection(function (err, conn) {

        conn.query('SELECT * FROM tb_user WHERE email = ? OR username = ?',
            [email, username]
            , function (error, rows, fields) {
                if (error) return response.err("Request timed out / No internet access", error)

                if (rows.length == 0) {

                    conn.query('INSERT INTO tb_user (username, email, password, phone) VALUES (?,?,?,?)',
                        [username, email, password, phone]
                        , function (error, rows, fields) {

                            if (error) return response.err("Connection timed out / no Internet connection " + error, res);

                            conn.query('SELECT * FROM tb_user WHERE user_id = ?',
                                [rows.insertId]
                                , function (error, rows, fields) {

                                    if (error) return response.err("Connection timed out / no Internet connection " + error, res)

                                    if (rows) {

                                        res.json(rows[0])
                                        res.end()

                                    }

                                });

                        });

                } else {

                    response.err("Email / Username is already taken!", res)

                }

                conn.release()

            })

    })

};

//
// login user
//
exports.loginUser = function (req, res) {

    var eml = req.body.eml
    var pass = md5(req.body.pass)

    conn.getConnection(function (err, conn) {

        conn.query('SELECT * FROM tb_user WHERE email = ?',
            [eml]
            , function (error, rows, fields) {

                if (error) return response.err("Request Timed Out / No Internet Access " + error, res)

                if (rows.length != 0) {

                    if (rows[0].password == pass) {
                        res.json(rows[0])
                        res.end()
                    }

                    else { response.err("Password incorrect", res) }

                } else {
                    response.err("User not registered", res)
                }

                conn.release()

            });

    })

}

/**
 * get user
 */
exports.user = function (req, res) {

    conn.getConnection(function (err, conn) {

        var userId = req.body.user_id

        if (userId !== undefined) {

            conn.query("SELECT * FROM tb_user WHERE user_id = ?",
                [userId]
                , function (error, rows, fields) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.json(rows[0])
                        res.end()
                    }

                    conn.release()

                });

        } else {

            conn.query("SELECT * FROM tb_user", function (error, rows, fields) {
                if (error) {
                    console.log(error)
                } else {
                    res.json(rows)
                    res.end()
                }

                conn.release()

            });

        }

    })
};

exports.userUpdate = function (req, res) {

    var user_id = req.body.user_id
    var username = req.body.username
    var phone = req.body.phone
    var email = req.body.email
    var caption = req.body.caption

    conn.getConnection(function (err, conn) {

        conn.query('UPDATE tb_user SET username = ?, phone = ?, email = ?,caption = ?  WHERE user_id = ?',
            [username, phone, email, caption, user_id]
            , function (error, rows, fields) {

                if (error) return response.err("Request timed out / No internet access", error)

                if (rows.affectedRows) {

                    response.ok("Success Update", res)

                } else {

                    response.err("Fialed updating user data")

                }

                conn.release()

            })

    })

};

/**
 * get article
 */
exports.article = function (req, res) {

    conn.getConnection(function (err, conn) {

        var articleId = req.body.article_id

        if (articleId !== undefined) {

            conn.query('SELECT * FROM tb_article WHERE article_id = ?',
                [articleId]
                , function (error, rows, fields) {
                    if (error) {
                        console.log(error)
                    } else {
                        res.json(rows[0])
                        res.end()
                    }
                    conn.release()

                });

        } else {

            conn.query('SELECT * FROM tb_article', function (error, rows, fields) {
                if (error) {
                    console.log(error)
                } else {
                    res.json(rows)
                    res.end()
                }

                conn.release()

            });

        }

    })
};

/**
 * Article Hot News
 */
exports.articleHot = function (req, res) {

    conn.getConnection(function (err, conn) {

        conn.query('SELECT * FROM tb_article WHERE category = "hot" ', function (error, rows, fields) {
                if (error) {
                    console.log(error)
                } else {
                    res.json(rows)
                    res.end()
                }
                conn.release()

            });

    })
};

/**
 * Article Daily News
 */
exports.articleDaily = function (req, res) {

    conn.getConnection(function (err, conn) {

        conn.query('SELECT * FROM tb_article WHERE category = "daily" ', function (error, rows, fields) {
                if (error) {
                    console.log(error)
                } else {
                    res.json(rows)
                    res.end()
                }
                conn.release()

            });

    })
};

/**
 * create Article
 */
exports.createArticle = function (req, res) {

    upload(req, res, err => {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();

        var Month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

        if (dd < 10) {
            dd = '0' + dd;
        }

        var dateTimeStamp = Month[mm] + ' ' + dd.toString();
        // var dateTimeStamp =  mm.toString() + '-' + dd.toString() + '-' + yyyy.toString();

        if (req.file !== undefined) {

            var title = req.body.title
            var article_image = req.file.filename
            var date = dateTimeStamp
            var description = req.body.description
            var category = req.body.category === undefined ? "daily" : req.body.category

            conn.getConnection(function (err, conn) {

                conn.query('INSERT INTO tb_article (image,title,date,description,category) VALUES (?,?,?,?,?)',
                    [article_image, title, date, description, category]
                    , function (error, rows, fields) {

                        if (error) response.err("Failed create article " + error, res)

                        if (rows.affectedRows && rows.insertId) {

                            response.ok("Success create article", res)
                        }

                        conn.release()

                    })

            })

        } else {
            response.err("Please add some article image ", res)
        }

    })
}

exports.articleUpdate = function (req, res) {

    upload(req, res, err => {

        var article_id = req.body.article_id
        var title = req.body.title
        var article_image = req.file.filename
        var date = dateTimeStamp
        var description = req.body.description
        var category = req.body.category === undefined ? "daily" : req.body.category

        if (req.file !== undefined) {

            conn.getConnection(function (err, conn) {

                conn.query('UPDATE tb_article SET image = ?, title = ?, date = ?, description = ?, category = ? WHERE article_id = ?',
                    [article_image, title, date, description, category, article_id]
                    , function (error, rows, fields) {

                        if (error) response.err("Failed update article " + error, res)

                        if (rows.affectedRows && rows.insertId) {

                            response.ok("Success update article", res)
                        }

                        conn.release()

                    })

            })

        } else {

            conn.getConnection(function (err, conn) {

                conn.query('UPDATE tb_article SET title = ?, date = ?, description = ?, category = ? WHERE article_id = ?',
                    [title, date, description, category, article_id]
                    , function (error, rows, fields) {

                        if (error) response.err("Failed create article " + error, res)

                        if (rows.affectedRows && rows.insertId) {

                            response.ok("Success create article", res)
                        }

                        conn.release()

                    })

            })

        }

    })

}

exports.articleSearch = function (req, res) {

    var search = req.body.search

    var dynamicInput = '%'.concat(search.concat('%'));

    console.log(dynamicInput)

    conn.getConnection(function (err, conn) {

        conn.query('SELECT * FROM tb_article WHERE title LIKE ?',
            [dynamicInput]
            , function (error, rows, fields) {

                if (error) {
                    response.err("Failed update article " + error, res)
                } else {
                    res.json(rows)
                    res.end()
                }

                conn.release()

            })

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