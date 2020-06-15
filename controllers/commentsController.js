const Treads = require('../models/treads');
const Comments = require('../models/comments');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { validationResult } = require('express-validator');
const { getSocket } = require('../core/socket');


exports.get = async (req, res, next) => {
    const treadId = req.params.treadId;
    let { from, to } = req.query;
    
    from = parseInt(from);
    to = parseInt(to);
    
    if (from || to) {
        let comment = await Comments
            .findOne({ treadId });
        
        comment = comment.slice(from - 1, to);
        comment = comment.map(tread => {
            tread.comments = tread.comments.slice(0, 3);
            return tread;
        })
        res.status(200).json(comment);
    } else {
        const comments = await Comments
            .find({ treadId });
        
        res.json(comments);
    }
}

exports.create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        throw 'error';
    }
    
    const { text, name, imagesUrl = [], reply } = req.body;
    
    const treadId = req.params.treadId;
    const comment = new Comments({
        imagesUrl,
        text,
        treadId,
        name,
        reply
    });
    
    const upComment = await comment.save();
    if (reply) {
        
        const replyComment = await Comments.findById(reply);
        
        replyComment.replyes.push(upComment._id);
        await replyComment.save();
    }
    
    const token = jwt.sign({ accessId: upComment._id }, 'zipper.TV4')
    
    const tread = await Treads.findById(treadId);
    tread.comments.push(comment._id);
    await tread.save();
    
    let io = getSocket();
    res.status(201).json({
        message: 'Success',
        token,
        upComment
    });
    
    io.emit('comment', upComment);
    io = null;
}

exports.edit = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        throw 'error';
    }
    
    const { name, text, imagesUrl, reply } = req.body;
    
    const commentId = req.params.commentId;
    const comment = await Comments.findById(commentId);
    
    comment.name = name;
    comment.text = text;
    comment.imagesUrl = imagesUrl;
    comment.reply = reply;
    comment._id = comment._id;
    
    const upComment = await comment.save();
    
    if (reply) {
        const replyComment = await Comments.findById(reply);
        const replyIndex = replyComment.replyes.findIndex(reply => reply === comment._id)
        replyComment.replyes.splice(replyIndex, 1, reply)
        await replyComment.save();
    }
    
    res.status(201).json({
        message: 'Success',
        comment
    });
    
    const io = getSocket();
    io.emit('upComment', upComment);
    
}

exports.delete = async (req, res, next) => {
    const comment = await Comments.deleteID(req.params.commentId);
    
    const replyComment = await Comments.findById(comment._id);
    
    if (replyComment) {
        const replyIndex = replyComment.replyes.findIndex(reply => reply === comment._id)
        replyComment.replyes.splice(replyIndex, 1);
        
        await replyComment.save();
    }
    
    res.status(201).json({
        message: `Comment ${ comment._id } was deleted successfully`,
        comment
    });
    let io = getSocket();
    io.emit('delComment', comment._id);
    io = null;
}
