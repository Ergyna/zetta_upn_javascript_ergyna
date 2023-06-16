function purchaseBook(detailBuku, harga, diskon, taxPercentage, creditTerm) {
  // Define constant variables
  const DISCOUNT_DIVISOR = 100;
  const TAX_DIVISOR = 100;

  // Define boolean variable
  let isTaxIncluded = false;

  // Calculate discount and tax amounts
  let discountAmount = harga * diskon / DISCOUNT_DIVISOR;
  let priceAfterDiscount = harga - discountAmount;
  let taxAmount = priceAfterDiscount * taxPercentage / TAX_DIVISOR;

  // Determine if tax is included or not
  if (taxPercentage > 0) {
    isTaxIncluded = true;
  }

  // Calculate price after tax
  let priceAfterTax;
  if (isTaxIncluded) {
    priceAfterTax = priceAfterDiscount;
  } else {
    priceAfterTax = priceAfterDiscount + taxAmount;
  }

  // Calculate price for each credit term
  let creditPrice = priceAfterTax / creditTerm;

  // Print book details, discount information, and tax information
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

  // Calculate and print credit due every month
  let creditDue = [];
  for (let i = 0; i < creditTerm; i++) {
    creditDue.push({
      month: i + 1,
      amount: creditPrice.toFixed(2),
    });
  }

  console.log("Credit Due Every Month:");
  console.log(creditDue);
}