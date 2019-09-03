const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const errorHandler = require('./middlewares/errorhandler');
const tokenExtractor = require('./middlewares/tokenextractor');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false });

app.use(cors());
app.use(bodyParser.json());

app.use(tokenExtractor.extractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler.err);

module.exports = app;
