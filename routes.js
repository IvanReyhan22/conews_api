'use strict';

module.exports = function (app) {

    var conews = require('./controller');

    app.route('/')
        .get(conews.index);

    // User
    app.route('/users')
        .get(conews.user);
    app.route('/userById')
        .get(conews.user);
    app.route('/register')
        .post(conews.createUser);
    app.route('/login')
        .post(conews.loginUser);

    // Article
    app.route('/article')
        .get(conews.article);
    app.route('/articleById')
        .get(conews.article);
    app.route('/article/create')
        .post(conews.createArticle);
};
