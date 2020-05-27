const Board = require('../models/boards');
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
        
        const { title, description, theme } = req.body;
        const board = new Board({
            title,
            description,
            theme
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
        const board = await Board
            .findById(boardId)
            .populate('treads')
        const treads = board.treads;
        
        treads.length = treads.length < to ? to + 1 : treads.length;
        treads.splice(0, from + 1)
        
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
