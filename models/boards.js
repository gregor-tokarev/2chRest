const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    theme: {
        type: String
    },
    treads: [{
        type: mongoose.Types.ObjectId,
        ref: 'Treads'
    }]
}, { timestamps: true });

boardSchema.statics.getTreadsCount = function(boardId) {
    return this.findById(boardId)
        .then(board => {
          const treadLengt = board.treads.length;
          return treadLengt;
        })
}

module.exports = mongoose.model('Boards', boardSchema)
