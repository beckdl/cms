var mongoose = require('mongoose');
var schema = mongoose.Schema;

var contactSchema = new schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  imageUrl: { type: String },
  group: [{ type: schema.Types.Mixed }]
});

module.exports = mongoose.model('Contact', contactSchema);