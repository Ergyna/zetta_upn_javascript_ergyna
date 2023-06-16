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

// Create a new book
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

    book.title = req.body.title;
    book.author = req.body.author;
    book.price = req.body.price;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
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

// Get books with match query
app.get('/books/match', async (req, res) => {
  try {
    const { title } = req.query;

    const books = await Book.find({
      title: { $regex: title, $options: 'i' },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sorted books
app.get('/books/sort', async (req, res) => {
  try {
    const { sortBy } = req.query;

    const sortOptions = {
      title: 'title',
      author: 'author',
      price: 'price',
    };

    const books = await Book.find().sort(sortOptions[sortBy]);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Concatenate fields in books
app.get('/books/concat', async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $project: {
          _id: 0,
          bookInfo: {
            $concat: ['$title', ' - ', '$author'],
          },
        },
      },
    ]);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lookup bookshelves with books
app.get('/bookshelves/lookup', async (req, res) => {
  try {
    const bookshelves = await Bookshelf.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookIds',
          foreignField: '_id',
          as: 'books',
        },
      },
    ]);

    res.json(bookshelves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
