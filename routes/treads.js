const express = require('express'); // import express
const router = express.Router(); // create router

//* Importing Controllers
const treadController = require('../controllers/treadsController');

router.post('/add/:boardId', treadController.add);

router.put('/edit/:treadId', treadController.edit);
//
// router.get('/comments/:id', treadController.comments);
//
// router.get('/popular/:count', treadController.popular);
//
module.exports = router;
