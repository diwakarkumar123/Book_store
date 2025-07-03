const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/fileHandler');

const BOOKS_FILE = 'books.json';

// // GET all books
// const getAllBooks = async (req, res) => {
//   const books = await readData(BOOKS_FILE);
//   res.json(books);
// };

// GET book by ID
const getBookById = async (req, res) => {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
};

// POST add new book
const addBook = async (req, res) => {
  let { title, author, genre, publishedYear } = req.body;

  if (!title || !author || !genre || publishedYear === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (typeof genre !== 'string') {
    return res.status(400).json({ message: 'Genre must be a string' });
  }

  publishedYear = Number(publishedYear);
  if (isNaN(publishedYear)) {
    return res.status(400).json({ message: 'PublishedYear must be a number' });
  }

  const books = await readData(BOOKS_FILE);

  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.userId
  };

  books.push(newBook);
  await writeData(BOOKS_FILE, books);

  res.status(201).json({ message: 'Book added successfully', book: newBook });
};

// PUT update book
const updateBook = async (req, res) => {
  const books = await readData(BOOKS_FILE);

  const index = books.findIndex(b => b.id === req.params.id);

  if (index === -1)
    return res.status(404).json({ message: 'Book not found' });

  const book = books[index];
  if (book.userId !== req.user.userId)
    return res.status(403).json({ message: 'Unauthorized: you are not able to update this book only who add the book should be able to update' });

  let { title, author, genre, publishedYear } = req.body;

  if (genre !== undefined && typeof genre !== 'string') {
    return res.status(400).json({ message: 'Genre must be a string' });
  }

  if (publishedYear !== undefined) {
    publishedYear = Number(publishedYear);
    if (isNaN(publishedYear)) {
      return res.status(400).json({ message: 'PublishedYear must be a number' });
    }
  }

  books[index] = {
    ...book,
    title: title ?? book.title,
    author: author ?? book.author,
    genre: genre ?? book.genre,
    publishedYear: publishedYear ?? book.publishedYear
  };

  await writeData(BOOKS_FILE, books);
  res.json({ message: 'Book updated successfully', book: books[index] });
};

// DELETE book
const deleteBook = async (req, res) => {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);

  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (book.userId !== req.user.userId)
    return res.status(403).json({ message: 'Unauthorized: Not your book' });

  const filteredBooks = books.filter(b => b.id !== req.params.id);
  await writeData(BOOKS_FILE, filteredBooks);

  res.json({ message: 'Book deleted successfully' });
};

const searchBooksByGenre = async (req, res) => {
  const { genre } = req.query;
  console.log(genre,'genre')
  if (!genre) {
    return res.status(400).json({ message: 'Genre query is required' });
  }

  const books = await readData(BOOKS_FILE);
  const filtered = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());

  res.json({ count: filtered.length, books: filtered });
};
const getAllBooks = async (req, res) => {
  const books = await readData(BOOKS_FILE);

  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginated = books.slice(start, end);
  res.json({
    total: books.length,
    page,
    limit,
    books: paginated
  });
};

module.exports = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooksByGenre
};
