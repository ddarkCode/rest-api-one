const { Router } = require('express');
const debug = require('debug')('app:bookRouter');

const Book = require('../models/bookModel');

const routes = () => {
  const bookRouter = Router();

  bookRouter
    .route('/')
    .get((req, res) => {
      const query = {};
      if (req.query.genre) {
        query.genre = req.query.genre;
      }
      Book.find(query, (err, foundBooks) => {
        if (err) {
          debug(err);
          return res.status(404).json({
            error: err.message,
            meaning: 'Books Not Found',
          });
        }
        return res.json(foundBooks);
      });
    })
    .post((req, res) => {
      const newBook = new Book(req.body);
      newBook.save((err, savedBook) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
            meaning: 'Internal Server error, validation failed',
          });
        }
        return res.status(201).json(savedBook);
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
          return res.status(404).json({
            error: err.message,
            meaning: 'Book Not Found',
          });
        }
        return res.status(200).json(foundBook);
      });
    });
  return bookRouter;
};

module.exports = routes;
