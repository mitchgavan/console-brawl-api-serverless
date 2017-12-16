'use strict';

const mongoose = require('mongoose')
const bluebird = require('bluebird')
const Game = require('./model/Game')

mongoose.Promise = bluebird

const MONGO_STRING = process.env.MONGODB_STRING

const errorResponse = (statusCode, message) => ({
  statusCode: statusCode || 501,
  headers: { 'Content-Type': 'text/plain' },
  body: message || 'Incorrect Id',
});

module.exports.getGame = (event, context, callback) => {
  const DB = mongoose.connect(MONGO_STRING).connection
  const id = event.pathParameters.id

  DB.once('open', () => {
    Game.findOne({ id: id })
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
        DB.close()
      })
  })
}

module.exports.createGame = (event, context, callback) => {
  const DB = mongoose.connect(MONGO_STRING).connection
  const data = JSON.parse(event.body)

  DB.once('open', () => {
    Game.create(data)
      .then((game) => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ name: game.name })
        })
      })
      .catch((err) => {
        callback(null, errorResponse(err.statusCode, err.message))
      })
      .finally(() => DB.close())
  })
}

// TODO: add update handler
