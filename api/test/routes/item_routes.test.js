'use strict';

require('../../../server.js');

let mongoose = require('mongoose');
let { Mockgoose } = require('mockgoose');
let mockgoose = new Mockgoose(mongoose);

let chai = require('chai');
let chaihttp = require('chai-http');
chai.use(chaihttp);
let { expect } = chai;

let Item = require('../../models/item');

describe('Item REST API endpoints', function() {
  // Extend timeout for mockgoose
  this.timeout(120000);

  before(function(done) {
    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', (error) => {
        done();
      });
    });

    // Lets add data to the mock database
    let item1 = new Item({ author: 'Test', name: 'yep' });
    item1.save((error, data) => {
      if (error) {
        return done(error);
      }
      // Assign item for testing purposes
      this.item = data;
      done();
    });

    let item2 = new Item({ author: 'Your mom', name: 'whoa' });
    item2.save((error, data) => done());
  });

  after(function(done) {
    // Disconnect the database after each test
    mockgoose.prepareStorage().then(() => {
      mockgoose.helper.reset().then(() => {
        mongoose.connection.db.dropDatabase((error) => {
          if (error) {
            done(error);
          }
          done();
        });
      });
    });
  });

  //
  // BEGIN CRUD TESTS FOR ENDPOINTS
  // =======================================
  it('should properly make a GET request for items in the DB', function(done) {
    chai.request('localhost:8080')
      .get('/api/items')
      .end((error, res) => {
        expect(error).to.eql(null);
        expect(res.status).to.eql(200);

        expect(res.body.items.length).to.eql(2);
        expect(res.body.items[0].author).to.eql('Test');
        expect(res.body.items[1].author).to.eql('Your mom');

        done();
      });
  });

  it('should properly make a POST request', function(done) {
    chai.request('localhost:8080')
      .post('/api/items')
      .send({ author: 'Yas', name: 'It worked' })
      .end((error, res) => {
        expect(error).to.eql(null);
        expect(res.status).to.eql(200);

        expect(typeof res.body.item).to.eql('object');
        expect(res.body.item).to.have.property('_id');
        expect(res.body.item).to.have.property('author');
        expect(res.body.item).to.have.property('name');
        expect(res.body.item.author).to.eql('Yas');
        expect(res.body.item.name).to.eql('It worked');

        done();
      });
  });

  it('should properly make a PUT request', function(done) {
    chai.request('localhost:8080')
      .put(`/api/items/${this.item._id}`)
      .send({ author: 'Changed', name: 'It worked' })
      .end((error, res) => {
        expect(error).to.eql(null);
        expect(res.status).to.eql(200);

        expect(res.body.item.author).to.eql('Changed');
        expect(res.body.item.name).to.eql('It worked');

        done();
      });
  });

  it('should properly make a DELETE request', function(done) {
    chai.request('localhost:8080')
      .delete(`/api/items/${this.item._id}`)
      .end((error, res) => {
        expect(error).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.eql({});

        // Lets make sure the item was in fact deleted
        Item.findById(this.item._id, (error, data) => {
          expect(error).to.eql(null);
          expect(data).to.eql(null);
        });

        done();
      });
  });
});
