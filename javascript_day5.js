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

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  });