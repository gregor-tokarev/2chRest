const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const currentId = req.path.split('/')[req.path.split('/').length - 1];
    try {
        const token = req.get('Authorization').split(' ')[1];
        const { accessId } = jwt.verify(token, 'zipper.TV4');
        if (accessId === currentId)
            next();
        else
            throw 'error'
    } catch (error) {
        res.status(403).json({
            message: 'No rules to this operation'
        })
    }
}
