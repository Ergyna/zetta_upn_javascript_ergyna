const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost/bookstore', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to database');
});

// Book model
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
const Book = mongoose.model('Book', bookSchema);

// Bookshelf model
const bookshelfSchema = new mongoose.Schema({
  bookIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
});
const Bookshelf = mongoose.model('Bookshelf', bookshelfSchema);

// Routes

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);

  return res.status(200).json({ message: 'Login successful', token });
});

// Purchase route
app.post('/purchase', authenticate, (req, res) => {
  const { detailBuku, harga, diskon, taxPercentage, creditTerm } = req.body;
  const DISCOUNT_DIVISOR = 100;
  const TAX_DIVISOR = 100;

  let isTaxIncluded = false;
  let discountAmount = harga * diskon / DISCOUNT_DIVISOR;
  let priceAfterDiscount = harga - discountAmount;
  let taxAmount = priceAfterDiscount * taxPercentage / TAX_DIVISOR;

  if (taxPercentage > 0) {
    isTaxIncluded = true;
  }
  let priceAfterTax;
  if (isTaxIncluded) {
    priceAfterTax = priceAfterDiscount;
  } else {
    priceAfterTax = priceAfterDiscount + taxAmount;
  }
});

// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single book
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a book
app.post('/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
  });

  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.price = req.body.price || book.price;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a bookshelf
app.post('/bookshelves', async (req, res) => {
  const bookshelf = new Bookshelf({
    bookIds: req.body.bookIds,
  });

  try {
    const newBookshelf = await bookshelf.save();
    res.status(201).json(newBookshelf);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bookshelves
app.get('/bookshelves', async (req, res) => {
  try {
    const bookshelves = await Bookshelf.find();
    res.json(bookshelves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single bookshelf by ID
app.get('/bookshelves/:id', async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findById(req.params.id);
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf not found' });
    }
    res.json(bookshelf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bookshelf
app.put('/bookshelves/:id', async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findById(req.params.id);
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf not found' });
    }

    bookshelf.bookIds = req.body.bookIds || bookshelf.bookIds;

    const updatedBookshelf = await bookshelf.save();
    res.json(updatedBookshelf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a bookshelf
app.delete('/bookshelves/:id', async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findById(req.params.id);
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf not found' });
    }

    await bookshelf.remove();
    res.json({ message: 'Bookshelf deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Get bookshelves with filtered books using elemMatch
app.get('/bookshelves/filtered-books/:genre', async (req, res) => {
  try {
    const genre = req.params.genre;

    const bookshelves = await Bookshelf.find({
      bookIds: { $elemMatch: { genre: genre } }
    });

    res.json(bookshelves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bookshelf and its books using arrayFilters
app.put('/bookshelves/:id/update-books', async (req, res) => {
  try {
    const bookshelf = await Bookshelf.findById(req.params.id);
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf not found' });
    }

    const bookIds = req.body.bookIds;

    await Bookshelf.updateOne(
      { _id: req.params.id },
      { $set: { bookIds: bookIds } },
      { arrayFilters: [{ 'elem._id': { $in: bookIds } }] }
    );

    res.json({ message: 'Bookshelf updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get distinct genres of books
app.get('/books/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
