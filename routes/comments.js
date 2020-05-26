const express = require('express');
const router = express.Router();
const tokenCheck = require('../middleware/tokenChek');
const validator = require('../validation/commentValidation');

const commentController = require('../controllers/commentsController')

router.post('/:treadId', validator.create, commentController.create);

router.put('/:commentId', tokenCheck, validator.edit, commentController.edit);

router.delete('/:commentId', tokenCheck, commentController.delete)

module.exports = router;
