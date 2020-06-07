const express = require('express'); // import express
const router = express.Router(); // create router
const validator = require('../validation/treadValidation'); // Validation
const tokenCheck = require('../middleware/tokenChek');

//* Importing Controllers
const treadController = require('../controllers/treadsController');

router.get('/:treadId', treadController.getOne)

router.post('/:boardId', validator.create, treadController.create);

router.put('/:treadId', tokenCheck, treadController.edit);

router.delete('/:treadId', tokenCheck, treadController.delete);

module.exports = router;
