const { Router } = require('express');

const Book = require('../models/bookModel');
const {
  getAllBook,
  postANewBook,
  getSingleBook,
  putSingleBook,
  patchSingleBook,
  deleteSingleBook,
} = require('../controllers/bookController')(Book);

const routes = () => {
  const bookRouter = Router();

  bookRouter.route('/').get(getAllBook).post(postANewBook);

  bookRouter.use('/:bookId', (req, res, next) => {
    const { bookId } = req.params;
    req.bookId = bookId;
    next();
  });
  bookRouter
    .route('/:bookId')
    .get(getSingleBook)
    .put(putSingleBook)
    .patch(patchSingleBook)
    .delete(deleteSingleBook);
  return bookRouter;
};

module.exports = routes;
