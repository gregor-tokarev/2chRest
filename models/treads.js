const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treadSchema = new Schema({
  title: String,
  text: String,
  comments: [{
    type: mongoose.Types.ObjectId,
    ref: 'Comments'
  }]
}, {timestamped: true})

module.exports = mongoose.model('Treads', treadSchema);
