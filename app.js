const express = require('express');
const app = express();
const mongoose = require('mongoose');

//* Importing Routers
const errorRoutes = require('./routes/error');
const treadRoutes = require('./routes/treads');
const boardRoutes = require('./routes/boards')

app.use(express.json()); // parse body json in any req
app.use((req, res, next) => { // set CORS to public access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
})

app.use('/tread', treadRoutes);

app.use('/board', boardRoutes)

app.use(errorRoutes)

mongoose.connect('mongodb+srv://root:zipper.TV4@main-ly8nz.gcp.mongodb.net/boards?retryWrites=true&w=majority')
    .then(res => {
      app.listen(8080)
    })
    .catch(error => {
      throw new Error(error)
    })
