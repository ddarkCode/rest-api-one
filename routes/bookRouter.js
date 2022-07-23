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

  bookRouter.use('/:bookId', (req, res, next) => {
    const { bookId } = req.params;
    req.bookId = bookId;
    next();
  });
  bookRouter
    .route('/:bookId')
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
    })
    .put((req, res) => {
      const { bookId } = req;
      Book.replaceOne({ _id: bookId }, req.body, (err, replacedBook) => {
        if (err) {
          return res.status(404).json(err);
        }
        return res
          .status(200)
          .json({ message: 'Replace operation was successfull' });
      });
    })
    .patch((req, res) => {
      const { bookId } = req;
      Book.updateOne({ _id: bookId }, req.body, (err, updatedBook) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res
          .status(200)
          .json({ message: 'Update operation was successfull.' });
      });
    })
    .delete((req, res) => {
      const { bookId } = req;
      Book.findByIdAndRemove(bookId, (err, deletedBook) => {
        if (err) {
          return res.status(500).json(err);
        }
        return res.sendStatus(204);
      });
    });
  return bookRouter;
};

module.exports = routes;
