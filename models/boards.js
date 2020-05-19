const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  treads: [{
    type: mongoose.Types.ObjectId,
    ref: 'Treads'
  }]
}, {timestamped: true});

module.exports = mongoose.model('Boards', boardSchema)
