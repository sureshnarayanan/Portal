// configuration ===========================================
var port = process.env.PORT || 8080; // set our port
process.env.NODE_ENV = process.env.NODE_ENV || 'development'; //set Environment
// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// config files
var config = require('./server/config/config');

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/client')); // set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client/app')); // set the static files location /public/img will be /img for users
// routes ==================================================
require('./server/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);
console.log('App running on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
