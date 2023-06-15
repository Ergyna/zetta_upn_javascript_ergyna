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

function generateToken(user) {
  return jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.user = user;
  next();
}

function calculateCreditTerm(price, creditTerm, additionalPriceTerms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const creditPrice = price / creditTerm;
      const termPrices = [];

      for (let i = 0; i < creditTerm; i++) {
        let termPrice = creditPrice;

        const additionalPrice = additionalPriceTerms.find(term => term.term === (i + 1));
        if (additionalPrice) {
          termPrice += additionalPrice.price;
        }

        termPrices.push({
          term: i + 1,
          price: termPrice.toFixed(2)
        });
      }

      resolve(termPrices);
    }, 1000); 
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);

  return res.status(200).json({ message: 'Login successful', token });
});

app.post('/purchase', authenticate, async (req, res) => {
  const { detailBuku, harga, diskon, taxPercentage, creditTerm, additionalPriceTerms } = req.body;
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

  try {
    const creditTermPrices = await calculateCreditTerm(priceAfterTax, creditTerm, additionalPriceTerms);

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

    console.log("Credit Term Information:");
    console.log("Credit Term:", creditTerm);
    console.log("Credit Term Prices:", creditTermPrices);

    res.status(200).json({
      message: 'Purchase successful',
      bookDetails: detailBuku,
      price: harga,
      discountPercent: diskon,
      discountAmount: discountAmount,
      priceAfterDiscount: priceAfterDiscount,
      taxPercent: taxPercentage,
      taxAmount: taxAmount,
      priceAfterTax: priceAfterTax,
      creditTerm: creditTerm,
      creditTermPrices: creditTermPrices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing purchase' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
