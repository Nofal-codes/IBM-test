'use strict';
module.exports = function (app) {

  // importing function to be exectued upon reaching url
  var todoList = require('../controllers/Controller');

  // ****todoList Routes****
  app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

  app.route('/tasks/bydate')
    .get(todoList.read_by_range)


  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);


};