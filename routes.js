'use strict';

module.exports = function (app) {

    var conews = require('./controller');

    app.route('/')
        .get(conews.index);

    // AUTH
    app.route('/register')
        .post(conews.createUser);
    app.route('/login')
        .post(conews.loginUser);

    // Article
    app.route('/article')
        .get(conews.article);
    app.route('/article/create')
        .post(conews.createArticle);
};
