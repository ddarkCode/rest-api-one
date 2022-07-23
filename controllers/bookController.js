const debug = require('debug')('app:bookController');

function bookController(Book) {
  const getAllBook = (req, res) => {
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
      const booksWithLinks = foundBooks.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });
      return res.json(booksWithLinks);
    });
  };
  const postANewBook = (req, res) => {
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
  };
  const getSingleBook = (req, res) => {
    Book.findById(req.bookId, (err, foundBook) => {
      if (err) {
        return res.status(404).json({
          error: err.message,
          meaning: 'Book Not Found',
        });
      }
      const newBook = foundBook.toJSON();
      const genre = foundBook.genre.replace(' ', '%20');
      newBook.links = {};
      newBook.links.filterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      return res.status(200).json(newBook);
    });
  };
  const putSingleBook = (req, res) => {
    const { bookId } = req;
    Book.replaceOne({ _id: bookId }, req.body, (err, replacedBook) => {
      if (err) {
        return res.status(404).json(err);
      }
      return res
        .status(200)
        .json({ message: 'Replace operation was successfull' });
    });
  };
  const patchSingleBook = (req, res) => {
    const { bookId } = req;
    Book.updateOne({ _id: bookId }, req.body, (err, updatedBook) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res
        .status(200)
        .json({ message: 'Update operation was successfull.' });
    });
  };
  const deleteSingleBook = (req, res) => {
    const { bookId } = req;
    Book.findByIdAndRemove(bookId, (err, deletedBook) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.sendStatus(204);
    });
  };

  return {
    getAllBook,
    postANewBook,
    getSingleBook,
    putSingleBook,
    patchSingleBook,
    deleteSingleBook,
  };
}

module.exports = bookController;
