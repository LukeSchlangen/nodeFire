var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var secretSchema = new Schema({
  secrecyLevel: { type: Number, required: true, default: 5, min: 0, max: 5 },
  secretText: { type: String, required: true }
});

var Secret = mongoose.model('Secret', secretSchema);

module.exports = Secret;
