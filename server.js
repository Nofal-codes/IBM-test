'use strict';

var express = require('express')
var app = express()



//to convert to understable form when sending probably
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

//Connecting to the database
mongoose.connect('mongodb://localhost/Tododb')
mongoose.Promise = global.Promise

//routes
var routes = require('./api/routes/Routes') //importing route
routes(app) //register the route

//listening to port
var port =  3000 ||process.env.PORT
app.listen(port)
console.log('todo list RESTful API server started on: ' + port)

//providing backup for error 
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + '/ 404 not found'})
  })

