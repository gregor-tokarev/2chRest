module.exports = (error, req, res, next) => {
    res.status(500).json({
        message: 'Something go wrong',
        error
    })
}
