const express = require('express');
const app = express();
const mongoose = require('mongoose');
const socketManager = require('./core/socket');
require('dotenv').config();
const path = require('path');

//* middleware
const errorHandler = require('./middleware/errorHandeling');
const corsSet = require('./middleware/cors');

//* Importing Routers
const errorRoutes = require('./routes/error');
const treadRoutes = require('./routes/treads');
const boardRoutes = require('./routes/boards');
const commentRoutes = require('./routes/comments');


app.use(express.static(path.resolve(__dirname, 'data')));
app.use(express.json()); // parse body json in any req
app.use(express.urlencoded({ extended: false })); // parse body formData in any req
app.use(corsSet);

app.use('/tread', treadRoutes);

app.use('/board', boardRoutes);

app.use('/comment', commentRoutes);

app.use(errorRoutes);

app.use(errorHandler);

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.MONGO_URL)
    .then(res => {
        const server = app.listen(process.env.PORT || 8000);
        const io = socketManager.init(server);
    })
    .catch(err => {
        console.error(err)
    });
