const Board = require('../models/boards');
const Treads = require('../models/treads');
const { validationResult } = require('express-validator');


exports.createBoard = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                errors: errors.array()
            });
            throw 'error';
        }
        
        const { title, description, theme, name } = req.body;
        const board = new Board({
            title,
            description,
            theme,
            name
        })
        const upBoard = await board.save();
        res.status(201).json({
            board: upBoard,
            message: 'Success'
        })
    } catch (err) {
        throw Error(err)
    }
}

exports.getTreads = async (req, res, next) => {
    let { from, to } = req.query;
    from = parseInt(from);
    to = parseInt(to);
    const boardId = req.params.boardId;
    if (from || to) {
        const treads = await Treads
            .find({ boardId })
            .skip(from)
            .limit(to - from)
        
        res.status(200).json(treads)
        
    } else {
        let treads = await Board
            .findById(boardId)
            .populate('treads')
            .select('treads')
        treads = treads.treads
        res.status(200).json(treads)
    }
}

exports.oneBoard = async (req, res, next) => {
    const { boardName } = req.params;
    let { from, to } = req.query;
    from = parseInt(from);
    to = parseInt(to);
    
    if (from || to) {
        const board = await Board .findOne({ title: boardName })
            .populate({
                path: 'treads',
                populate: {
                    path: 'comments'
                }
                
            })
        board.treads = board.treads.slice(from - 1, to);
        board.treads = board.treads.map(tread => {
            tread.comments = tread.comments.slice(0, 3);
            return tread;
        });
        res.status(200).json(board);
        
    } else {
        const board = await Board
            .findOne({ title: boardName })
            .populate('treads');
        res.json(board);
    }
}

exports.boards = async (req, res, next) => {
    const boards = await Board.find().select('-treads');
    res.status(200).json(boards)
}

exports.getTreadsCount = async (req, res, next) => {
    const boardId = req.params.boardId;
    const treadsCount = await Board.getTreadsCount(boardId)
    res.status(200).json({
        treadsCount
    })
    
}
