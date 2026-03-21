var mongoose = require('mongoose');
var schema = mongoose.Schema;

var messageSchema = new schema({
  id: { type: String, required: true },
  subject: { type: String },
  msgText: { type: String, required: true },
  sender: { type: String, default: '' }
});

module.exports = mongoose.model('Message', messageSchema);