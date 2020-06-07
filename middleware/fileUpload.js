const multer = require('multer');
const path = require('path');

module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '..', '/data/images'))
        },
        filename: (req, file, cb) => {
            const filenameParts = file.originalname.split('.');
            const fileExt = filenameParts.splice(filenameParts.length - 1, 1);
            const fileName = filenameParts.join('.')
            cb(null, `${ fileName }-${ Date.now().toString() }.${ fileExt }`)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.split('/')[0] === 'image')
            cb(null, true)
        else
            cb(null, false)
    },
    limits: {
        fileSize: 655360000000,
        files: 5,
    }
})
