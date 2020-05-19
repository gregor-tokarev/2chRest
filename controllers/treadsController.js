const Treads = require('../models/treads');

exports.add = (req, res, next) => {
  const { title, text } = req.body;
  const tread = new Treads({
    title,
    text
  })
      .save()
      .then(tread => {
        res.status(201).json({
          tread,
          message: 'Success'
        })
      })
}

exports.edit = (req, res, next) => {
  const { title, text } = req.body;
  const treadId = req.params.treadId;
  
  Treads.findById(treadId)
      .then(tread => {
        tread.title = title;
        tread.text = text;
        return tread.save();
      })
      .then(tread => {
        res.status(200).json({
          tread,
          message: 'Success'
        })
      })
}
