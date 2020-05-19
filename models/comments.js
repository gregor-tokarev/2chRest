const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  title: String,
  text: String,
  imageUrl: String,
  replyes: [{
    type: mongoose.Types.ObjectId
  }]
}, {timestamped: true});

module.exports = mongoose.model('Comment', commentSchema);
