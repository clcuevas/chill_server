'use strict';

let Item = require('../models/item');

//
// Configure /items endpoints
// =================================
exports.getItems = (req, res) => {
  Item.find((error, items) => {
    if (error) {
      res.send(error);
    }

    res.json({ items });
  });
};

exports.postItem = (req, res) => {
  let item = new Item();

  item.author = req.body.author;
  item.name = req.body.name;

  // Save the new item
  item.save((error) => {
    if (error) {
      res.send(error);
    }

    res.json({ item });
  });
};

//
// Configure /items/:id endpoints
// ================================
exports.getItem = (req, res) => {
  Item.findById(req.params.id, (error, item) => {
    if (error) {
      res.send(error);
    }

    res.json({ item });
  });
};

exports.putItem = (req, res) => {
  Item.findById(req.params.id, (error, item) => {
    if (error) {
      res.send(error);
    }

    item.author = req.body.author;
    item.name = req.body.name;

    // Save the changes
    item.save((error) => {
      if (error) {
        res.send(error);
      }

      res.json({ item });
    });
  });
};

exports.deleteItem = (req, res) => {
  Item.remove({
    _id: req.params.id
  }, (error, item) => {
    if (error) {
      res.send(error);
    }

    res.json({});
  });
};
