'use strict';

//intiating connecting //needs perfomance review if implemnted correctly
var connection = require('mongoose');
var tank = connection.model('MYTasks', 'mytasks');  //name of model, collection


//list of ways to respond


// Create 
exports.create_a_task = (req, res) => {

  var new_task = new tank(req.body); //???
  console.log(req.body);
  console.log(new_task);

  new_task
    .save(function (err, task) {
      if (err)
        res.status(405).send(err);
      res.json(task);
    });

};

// Update an Entry
exports.update_a_task = (req, res) => {

  tank
    .findOneAndUpdate({ _id: req.params.taskId }, req.body, { new: true })
    .exec(function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });

};


// Delete an Entry
exports.delete_a_task = (req, res) => {

  tank
    .remove({
      _id: req.params.taskId
    })
    .exec(function (err, task) {
      if (err)
        res.send(err);
      res.json({ message: 'Task successfully deleted' });
    });

};


//export all
exports.list_all_tasks = (req, res) => {

  var query = {};

  tank
    .find(query)
    .exec(function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });

};


// Read By Id
exports.read_a_task = (req, res) => {

  tank
    .findById(req.params.taskId)
    .exec(function (err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });

};


// Read between dates
exports.read_by_range = (req, res) => {


  //YYYY-MM-DD
  var before = req.query.before;
  before = new Date(before);
  var after = req.query.after
  after = new Date(after);

  console.log( before );  
  console.log( after );  

  tank
    .find({
      Create_dated: {
        '$gte': after,
        '$lte': before
      }
    }).exec(function (err, task) {
      if (err)
        res.status(400).send("400 Bad Request");
      res.json(task);
    });

};


