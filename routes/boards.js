const express = require('express'); // import express
const router = express.Router(); // create router

//* Importing Controllers
const boardsController = require('../controllers/boardsController');

router.post('/create', boardsController.createBoard)

module.exports = router;
