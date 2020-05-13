var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    bodyParser = require('body-parser'),
    controller = require('./controller');
    serveIndex = require('serve-index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/storage', express.static('storage'), serveIndex('storage'))

var routes = require('./routes');
routes(app);

app.listen(port);
console.log('Server started on port: ' + port);