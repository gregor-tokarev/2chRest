const express = require('express'); // import express
const router = express.Router(); // create router

//* Importing Controllers
const errorController = require('../controllers/404Controller');


router.use(errorController.error);

module.exports = router;
