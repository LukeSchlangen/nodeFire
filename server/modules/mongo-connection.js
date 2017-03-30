var mongoose = require('mongoose');
var connectionString = require('./database-config');

var connectToMongoDatabase = function() {
  mongoose.connect(connectionString);

  mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ', connectionString);
  });

  mongoose.connection.on('error', function (err) {
    console.log('Mongoose failed to connect because error: ', err);
  });
}

module.exports = { connect: connectToMongoDatabase };
