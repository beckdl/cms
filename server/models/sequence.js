var mongoose = require('mongoose');
var schema = mongoose.Schema;

var sequenceSchema = new schema({
  maxDocumentId: { type: Number, required: true },
  maxMessageId: { type: Number, required: true },
  maxContactId: { type: Number, required: true },
});

module.exports = mongoose.model('Sequence', sequenceSchema);