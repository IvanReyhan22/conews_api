'use strict';

module.exports = function (app) {

    var conews = require('./controller');

    app.route('/')
        .get(conews.index);

    // User
    app.route('/register')
        .post(conews.createUser);
    app.route('/login')
        .post(conews.loginUser);
    app.route('/users')
        .get(conews.user);
    app.route('/userById')
        .post(conews.user);
    app.route('/user/update')
        .post(conews.userUpdate);

    // Article
    app.route('/article')
        .get(conews.article);
    app.route('/articleById')
        .post(conews.article);
    app.route('/article/create')
        .post(conews.createArticle);
    app.route('/article/update')
        .post(conews.articleUpdate);
};
