const Board = require('../models/boards');

exports.createBoard = (req, res, next) => {
  const { title, description } = req.body;
  const board = new Board({
    title,
    description
  })
  board
      .save()
      .then(result => {
        res.status(201).json({
          result,
          message: 'Success'
        })
      })
      .catch(err => {
        console.log(err)
      })
}
