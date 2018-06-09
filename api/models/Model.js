
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//document schema attributes
var TaskSchema = new Schema({

  title: {
    type: String,
    required: 'Kindly enter the title of the thread'
  },

  body: {
    type: String,
    required: 'Kindly provide body for the thread'
  },

  author: {
    type: String,
  },

  img1: {
    type: String,
  },

  genre: {
    type: Array,
  },

  Create_dated: {
    type: Date,
    // default: null
  },

  Updated_date: {
    type: Date,
  }

  /* status: {
     type: [{
       type: String,
       enum: ['pending', 'ongoing', 'completed']
     }],
     default: ['pending']
   },  */

});


// *** this function is to perform methods before/after dealing with the database ***
// Documention and tips for this part can be found on mongoose docts in middleware section
// In document middleware functions, this refers to the *document*. (init, validate, save, remove)
// In query middleware functions, this refers to the *query*. (count,find,findOne,findOneAndRemove,findOneAndUpdate,update)

TaskSchema.pre('findOneAndUpdate', function () {

  //console.log( this._update ); // as we can see from log this._update referes to the parameters recieved info from the client request
  // we check if a title update exists before we slgify it

  if (this._update.title) {   
    var x = this._update.title // = slugify(this._update.title);
    this.update({}, { $set: { 'title': x } });
  }

  if (this._update.body) {   
    this.update({}, { $set: { 'body': this._update.body } });
  }

  if (this._update.author) {   
    this.update({}, { $set: { 'author': this._update.author } });
  }

  if (this._update.img1) {   
    this.update({}, { $set: { 'img1': this._update.img1 } });
  }

  if (this._update.genre) {   
    this.update({}, { $set: { 'genre': this._update.genre } });
  }

  //update the modifying date
  this.update({}, { $set: { 'Updated_date': new Date() } });

});

TaskSchema.pre('save', function (next) {

  // get the current date
  var currentDate = new Date();

  //assign creation date 
  this.Create_dated = currentDate;
  // assign updated date
  this.Updated_date = currentDate;

  this.title = slugify(this.title);
  next();
});


//* geneal function to use (such as for vervication and shit)*/
// function to slugify a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = mongoose.model('MYTasks', TaskSchema);