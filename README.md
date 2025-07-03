A simple RESTful API built with Node.js and Express that allows users to register, login, and perform CRUD operations on books. Data is stored in JSON files instead of a database. Authentication is handled using JWT.

Setup Instructions
Clone the repository git clone https://github.com/diwakarkumar123/Book_store.git cd bookstore
How to test endpoints (via Postman or curl)
Download Postman: https://www.postman.com/downloads/

1Login and get token

Method: POST url :http://localhost:5000/login Body:--> raw { "email": "diwakar@.com", "password": "123456" } then copy the token fron the response

Add a book Method: POST url :http://localhost:5000/books Header:-- Authorization: Bearer
Body: { "title": "Dragon", "author": "Dinker kumar", "genre": "drama", "publishedYear": 2011 }
