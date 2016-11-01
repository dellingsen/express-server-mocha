var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var users = require('./services/users');

// Connect to the MongoDB
mongoose.connect('mongodb://localhost:27017/node-app');

// Use Express web app framework for routing
var app = express();

app.use(logger('dev'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

// route middleware that will happen on every request
router.use(function(req, res, next) {
  console.log('In router middleware: ' + req.method, req.url);
  // continue doing what we were doing and go to the route
  next();
});


// Define application routes

//Users REST API

// Create endpoint /users for POST
app.post('/users', function(req, res) {
  users.createUser(req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /users for GET
app.get('/users', function(req, res) {
  users.getUsers(function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for PUT
app.put('/users/:userid', function(req, res) {
  users.putUser(req.params.userid, req.body, function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for GET
app.get('/users/:userid', function(req, res) {
  users.getUser(req.params.userid, function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for GET
app.get('/users/:username', function(req, res) {
  users.getUserByName(req.params.username, function (out) {
    res.json(out)
  })
})

// Create endpoint /users/:user_id for DELETE
app.delete('/users/:userid', function(req, res) {
  users.deleteUser(req.params.userid, function (out) {
    res.json(out)
  })
})

app.delete('/users', function(req, res) {
  users.deleteAll(function (out) {
    res.json(out)
  })
})


//Create Http Server to listen for requests to routes
var server = app.listen(4000, function () {
  console.log('Listening on port', server.address().port)
})

app.use('/', router);

module.exports = app;
