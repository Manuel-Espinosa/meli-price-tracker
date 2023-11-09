export const isPriceDifferent = (newPrice, lastPrice) => {
    return newPrice.amount !== lastPrice.amount ||
           newPrice.regular_amount !== lastPrice.regular_amount;
  };