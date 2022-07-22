require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const { connect } = require('mongoose');

const Book = require('./models/bokModel');

const app = express();
const { PORT, MONGO_URL } = process.env;
const bookRouter = express.Router();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/books', bookRouter);

connect(MONGO_URL, {}, (err) => {
  if (err) {
    debug(err);
  } else {
    debug('Database sucessfully connected');
  }
});

bookRouter.route('/').get((req, res) => {
  const query = {};
  if (req.query.genre) {
    query.genre = req.query.genre;
  }
  Book.find(query, (err, foundBooks) => {
    if (err) {
      debug(err);
      return res.json(err);
    }
    return res.json(foundBooks);
  });
});
bookRouter
  .route('/:bookId')
  .all((req, res, next) => {
    const { bookId } = req.params;
    req.bookId = bookId;
    next();
  })
  .get((req, res) => {
    Book.findById(req.bookId, (err, foundBook) => {
      if (err) {
        debug(err);
        return res.json(err);
      }
      return res.status(200).json(foundBook);
    });
  });

app.get('/', (req, res) => {
  res.send('Welcome to my RESTful API');
});

app.listen(3000, () => {
  debug(`server is running on port ${PORT}`);
});
