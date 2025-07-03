const express = require('express')
const router = express.Router()
const bookapi = require("../controllers/bookController")
const { userAuth } = require('../middlewares/auth')

router.get('/books/search',userAuth, bookapi.searchBooksByGenre);

router.get('/books',userAuth, bookapi.getAllBooks);
router.get('/books/:id',userAuth,bookapi.getBookById);
router.post('/books', userAuth,bookapi.addBook);
router.put('/books/:id',userAuth, bookapi.updateBook);
router.delete('/books/:id',userAuth, bookapi.deleteBook);





module.exports= router
