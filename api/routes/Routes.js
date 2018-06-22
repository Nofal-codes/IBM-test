'use strict';
module.exports = function (app) {

  // importing function to be exectued upon reaching url
  var myController = require('../controllers/Controller');
  var rootName = 'Web/';

  // ****todoList html file Routes****
          // ****webpages****
  app.get('/', function (req, res) {
    res.sendFile(  'index.html', { root: rootName } );
  });

  app.get('/:app', function (req, res) {
    try {res.sendFile(  'apps/' + req.params.app , { root: rootName } ); }
    catch(e) { res.status(404).send({url: req.originalUrl + '/ 404 not found'}) }
  });

  app.get('/:first/:second', function (req, res) {
    try {res.sendFile(   req.params.first + '/' + req.params.second , { root: rootName } ); }
    catch(e) { res.status(404).send({url: req.originalUrl + '/ 404 not found'}) }
  });

  app.get('/:first/:second/:third', function (req, res) {
    try {res.sendFile(   req.params.first + '/' + req.params.second + '/' + req.params.third , { root: rootName } ); }
    catch(e) { res.status(404).send({url: req.originalUrl + '/ 404 not found'}) }
  });


// ****todoList Controller routes Routes****
  app.route('/tasks')
    .get(myController.create_a_task)

};

