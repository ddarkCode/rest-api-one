require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const { connect } = require('mongoose');

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

app.get('/', (req, res) => {
  res.send('Welcome to my RESTful API');
});

app.listen(3000, () => {
  debug(`server is running on port ${PORT}`);
});
