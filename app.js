require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const { connect } = require('mongoose');

const bookRouter = require('./routes/bookRouter')();

const app = express();
const { PORT, MONGO_URL } = process.env;

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connect(MONGO_URL, {}, (err) => {
  if (err) {
    debug(err);
  } else {
    debug('Database sucessfully connected');
  }
});

app.use('/api/books', bookRouter);

app.listen(3000, () => {
  debug(`server is running on port ${PORT}`);
});
