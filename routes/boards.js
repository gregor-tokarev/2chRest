const express = require('express'); // import express
const router = express.Router(); // create router
const validator = require('../validation/boardValidation');
//* Importing Controllers
const boardsController = require('../controllers/boardsController');

router.post('/', validator.create, boardsController.createBoard);

router.get('/', boardsController.boards);

router.get('/one/:boardName', boardsController.oneBoard);

router.get('/treads/:boardId', boardsController.getTreads);

router.get('/treads/count/:boardId', boardsController.getTreadsCount);

module.exports = router;
