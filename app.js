const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false });

app.use(cors());
app.use(bodyParser.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
