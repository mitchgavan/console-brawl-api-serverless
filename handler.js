'use strict';

const mongoose = require('mongoose')
const bluebird = require('bluebird')
const GameModel = require('./model/Game')

mongoose.Promise = bluebird

const MONGO_STRING = process.env.MONGODB_STRING

const errorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect Id',
});

module.exports.getGame = (event, context, callback) => {
  const db = mongoose.connect(MONGO_STRING).connection
  const id = event.pathParameters.id;

  db.once('open', () => {
    GameModel.findOne({ id: id })
      .then((game) => {
        callback(null, { 
          statusCode: 200,
          body: JSON.stringify(game)
        })
      })
      .catch((err) => {
        callback(null, errorResponse(400, 'No game with that ID found'))
      })
      .finally(() => {
        db.close()
      })
  })
}

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
