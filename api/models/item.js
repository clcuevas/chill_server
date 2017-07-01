'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// TODO: Add more keys to the Item Schema
let itemSchema = new Schema({
  author: { type: String },
  name: { type: String }
});

module.exports = mongoose.model('Item', itemSchema);
