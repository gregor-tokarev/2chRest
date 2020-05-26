const mongoose = require('mongoose');
const Boards = require('./boards');
const fs = require('fs');

const Schema = mongoose.Schema;

const treadSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    imagesUrl: [{
        type: Object
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comments'
    }],
    boardId: {
        type: mongoose.Types.ObjectId,
        ref: 'Boards',
        required: true
    }
}, { timestamps: true })

treadSchema.statics.deleteID = async function(id) {
    const tread = await this.findByIdAndRemove(id);

    const board = await Boards.findById(tread.boardId);
    board.treads.splice(board.treads.findIndex(bTread => bTread._id === id), 1);

    tread.imagesUrl.forEach(img => fs.unlink(img.path, err => console.log(err)));

    await board.save();
    return tread;
}

module.exports = mongoose.model('Treads', treadSchema);
