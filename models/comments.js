const mongoose = require('mongoose');
const Treads = require('./treads');
const Boards = require('./boards');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    replyes: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comments'
    }],
    treadId: {
        type: mongoose.Types.ObjectId,
        ref: 'Treads',
        required: true
    }
}, { timestamps: true });

commentSchema.statics.deleteID = async function(id) {
    const commentId = id;
    const comment = await this.findByIdAndRemove(commentId);
    
    const tread = await Treads.findById(comment.treadId);
    tread.comments.splice(tread.comments.findIndex(bComment => bComment._id === commentId), 1);
    await tread.save();

    return comment;
}

module.exports = mongoose.model('Comments', commentSchema);