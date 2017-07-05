'use strict';

let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let morgan = require('morgan');

let mongoose = require('mongoose');
// TODO: Setup a process.ENV for the MONGOLAB_URI
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/chill_dev');

let itemRoutes = require('./api/routes/item_routes');

// TODO: Switch to CORS lib instead
// Configure the app to use the below headers/ access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  next();
});

// Configure the app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev'));

let port = process.env.PORT || 8080;

//
// ROUTES FOR THE API
// =================================
// eslint-disable-next-line new-cap
let router = express.Router();

// TODO: Lock down these routes
// TODO: Add User routes
// TODO: Add signin and login routes for authentication

// Items routes
router.route('/items')
  .get(itemRoutes.getItems)
  .post(itemRoutes.postItem);

// Individual Item routes
router.route('/items/:id')
  .get(itemRoutes.getItem)
  .put(itemRoutes.putItem)
  .delete(itemRoutes.deleteItem);

//
// REGISTER ROUTES
// =================================
app.use('/api', router);

//
// START THE SERVER
// =================================
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Server running on PORT ${port}`);
