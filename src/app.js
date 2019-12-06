require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const { NODE_ENV } = require('./config');
const validateBearerToken = require('./validatBearerToken');
const errorHandler = require('./errorHandler');
const bookmarkRouter = require('./bookmarkRouter');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(validateBearerToken);

app.use('/bookmarks', bookmarkRouter);

app.use(errorHandler);

module.exports = app;