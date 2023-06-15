function purchaseBook(detailBuku, harga, diskon, taxPercentage, stock, purchased) {
    // Define constant variables
    const DISCOUNT_DIVISOR = 100;
    const TAX_DIVISOR = 100;
  
    // Define boolean variable
    let isTaxIncluded = false;
  
    // Calculate discount and tax amounts
    let discountAmount = harga * diskon / DISCOUNT_DIVISOR;
    let priceAfterDiscount = price - discountAmount;
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
  
    // Calculate total price
    let totalPrice = priceAfterTax * purchased;
  
    // Check if there is enough stock to fulfill the purchase
    for (let i = 1; i <= purchased; i++) {
      if (i > stock) {
        console.log("Error: Not enough stock.");
        console.log("Current stock:", stock);
        console.log("Maximum purchase:", stock);
        return;
      }
    }
  
    // Update stock
    stock -= purchased;
  
    // Print book details, discount information, tax information, and purchase information
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
  
    console.log("Purchase Information:");
    console.log("Purchased:", purchased);
    console.log("Total Price:", totalPrice);
  
    // Check if there is still enough stock to purchase more books
    if (stock > 0) {
      console.log("Note: Additional books can still be purchased.");
    } else {
      console.log("Note: This book is currently out of stock.");
    }
  }