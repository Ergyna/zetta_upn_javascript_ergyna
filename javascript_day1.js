function purchaseBook(bookDetails, discountPercentage, taxPercentage) {
  // Define a constant variable for the tax rate
  const TAX_RATE = 0.01;
  
  // Compute the amount of discount and the price after discount
  const discountAmount = bookDetails.price * (discountPercentage / 100);
  const priceAfterDiscount = bookDetails.price - discountAmount;
  
  // Compute the amount of tax and the price after tax
  const taxAmount = priceAfterDiscount * (taxPercentage * TAX_RATE);
  const priceAfterTax = priceAfterDiscount + taxAmount;
  
  // Define a boolean variable to check if the book is expensive
  const isExpensive = priceAfterTax > 50;
  
  // Define a string variable for the purchase summary
  let purchaseSummary = `You bought ${bookDetails.title} by ${bookDetails.author} for ${bookDetails.price}$.`;
  if (discountPercentage > 0) {
    purchaseSummary += ` You got ${discountPercentage}% discount, saving ${discountAmount}$.`;
  }
  purchaseSummary += ` The final price after tx (${taxPercentage}%) is ${priceAfterTax}$.`;
  
  // Return an object with all the computed and defined values
  return {
    title: bookDetails.title,
    author: bookDetails.author,
    price: bookDetails.price,
    discountPercentage: discountPercentage,
    taxPercentage: taxPercentage,
    discountAmount: discountAmount,
    priceAfterDiscount: priceAfterDiscount,
    taxAmount: taxAmount,
    priceAfterTax: priceAfterTax,
    isExpensive: isExpensive,
    purchaseSummary: purchaseSummary,
  };
}