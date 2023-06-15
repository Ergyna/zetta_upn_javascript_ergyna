const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username }, 'secret');
  return res.status(200).json({ message: 'Login successful', token });
});

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

  let creditPrice = priceAfterTax / creditTerm;

  console.log("Book Details:");
  console.log("bookDetails:", detailBuku);
  console.log("Price:", harga);

  console.log("Discount Information:");
  console.log("Discount Percent:", diskon);
  console.log("Discount Amount:", discountAmount);
  console.log("Price After Discount:", priceAfterDiscount);

  console.log("Tax Information:");
  console.log("Tax Percent:", taxPercentage);
  console.log("Tax Amount:", taxAmount);
  console.log("Price After Tax:", priceAfterTax);

  console.log("Credit Information:");
  console.log("Credit Term:", creditTerm);
  console.log("Price per Term:", creditPrice);

  let creditDue = [];
  for (let i = 0; i < creditTerm; i++) {
    creditDue.push({
      month: i + 1,
      amount: creditPrice.toFixed(2),
    });
  }

  console.log("Credit Due Every Month:");
  console.log(creditDue);

  return res.status(200).json({ message: 'Purchase successful' });
});

app.post('/addBooks', authenticate, (req, res) => {
  const { books } = req.body;
  const bookSet = new Set();
  const bookMap = new Map();

  books.forEach((book) => {
    bookSet.add(book.title);
    bookMap.set(book.title, book);
  });

  const response = {
    message: 'Books added successfully',
    bookSet: Array.from(bookSet),
    bookMap: Array.from(bookMap.entries()),
  };

  return res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, 'secret');
  return res.status(200).json({ message: 'Login successful', token });
});

app.post('/addBooks', authenticate, (req, res) => {
  const { books } = req.body;
  const bookSet = new Set();
  const bookMap = new Map();

  books.forEach((book) => {
    bookSet.add(book.title);
    bookMap.set(book.title, book);
  });

  const response = {
    message: 'Books added successfully',
    bookSet: Array.from(bookSet),
    bookMap: Array.from(bookMap.entries()),
  };

  return res.status(200).json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
