var mongoose = require('mongoose');
var schema = mongoose.Schema;

var contactSchema = new schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  imageURL: { type: String },
  group: { type: schema.Types.ObjectId, ref: 'Contact' }
});

module.exports = mongoose.model('Contact', contactSchema);