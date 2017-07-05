'use strict';

let mongoose = require('mongoose');
let { Schema } = mongoose;

// TODO: Add more keys to the Item Schema
let itemSchema = new Schema({
  author: { type: String },
  name: { type: String }
});

// Lets create the model and export it
module.exports = mongoose.model('Item', itemSchema);
