const Treads = require('../models/treads');
const Comments = require('../models/comments');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { validationResult } = require('express-validator');
const { getSocket } = require('../core/socket');

exports.create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        throw 'error';
    }
    
    const { title, text, replyes } = req.body;
    const imagesUrl = req.files.map(img => ({
        path: img.path,
        url: `${process.env.HOST}/images/${img.filename}`
    }));
    const treadId = req.params.treadId;
    const comment = new Comments({
        imagesUrl,
        title,
        text,
        treadId,
        replyes
    });
    
    const upComment = await comment.save();
    const token = jwt.sign({ accessId: upComment._id }, 'zipper.TV4')
    res.status(201).json({
        message: 'Success',
        token,
        upComment
    });
    
    const io = getSocket();
    io.emit('comment', upComment)
    
    const tread = await Treads.findById(treadId);
    tread.comments.push(comment._id);
    tread.save();
}

exports.edit = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        throw 'error';
    }
    
    const { title, text, replyes = [] } = req.body;
    const imagesUrl = req.files.map(img => ({
        path: img.path,
        url: `${process.env.HOST}/images/${img.filename}`
    }));
    const commentId = req.params.commentId;
    const comment = await Comments.findById(commentId);
    
    comment.imagesUrl.forEach(img => fs.unlink(img.path, err => console.log(err)));
    
    comment.title = title;
    comment.text = text;
    comment.imagesUrl = imagesUrl;
    comment.replyes = replyes;
    
    const upComment = await comment.save();
    
    const io = getSocket();
    io.emit('upComment', upComment)
    res.status(201).json({
        message: 'Success',
        comment
    })
}

exports.delete = async (req, res, next) => {
    const comment = await Comments.deleteID(req.params.commentId);
    
    res.status(201).json({
        message: `Comment ${ comment._id } was deleted successfully`,
        comment
    });
    const io = getSocket();
    io.emit('delComment', comment._id);
}
