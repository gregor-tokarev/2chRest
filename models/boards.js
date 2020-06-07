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
    name: {
        type: String
    },
    treads: [{
        type: mongoose.Types.ObjectId,
        ref: 'Treads'
    }]
}, { timestamps: true });

boardSchema.statics.getTreadsCount = function(boardId) {
    return this.findById(boardId)
        .then(board => board.treads.length)
}

module.exports = mongoose.model('Boards', boardSchema)
