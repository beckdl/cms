var mongoose = require('mongoose');
var schema = mongoose.Schema;

var documentSchema = new schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  children: { type: schema.Types.ObjectId, ref: 'Document' },
  description: { type: String }
});

module.exports = mongoose.model('Document', documentSchema);