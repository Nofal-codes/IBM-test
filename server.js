'use strict';

var express = require('express');
var app = express();
var path = require('path');

//routes
var routes = require('./api/routes/Routes'); //importing route
routes(app); //register the route

//listening to port
var port =  3000 ||process.env.PORT;
app.listen(port);
console.log('todo list RESTful API server started on: ' + port);

//providing backup for error 
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + '/ 404 not found'})
  });

