import Product from '../models/productModel.js';
import fetchProductPrices from '../services/meliService.js';

const isPriceDifferent = (newPrice, lastPrice) => {
  return newPrice.amount !== lastPrice.amount ||
         newPrice.regular_amount !== lastPrice.regular_amount ||
         newPrice.type !== lastPrice.type ||
         newPrice.conditions.context_restrictions.length !== lastPrice.conditions.context_restrictions.length ||
         newPrice.currency_id !== lastPrice.currency_id;
};

export const getProductPrices = async (req, res) => {
  const { productId } = req.params;

  try {
    // Fetch the latest prices from MELI API
    const fetchedPrices = await fetchProductPrices(productId);

    // Check if the product already exists in the database
    let product = await Product.findOne({ id: productId });

    if (product) {
      // If product exists, check if any fetched prices are different from the last stored prices
      const pricesToUpdate = fetchedPrices.prices.filter(fetchedPrice => {
        const lastPrice = product.prices.find(p => p.type === fetchedPrice.type);
        return !lastPrice || isPriceDifferent(fetchedPrice, lastPrice);
      });

      // If there are new or different prices, update the product's prices
      if (pricesToUpdate.length > 0) {
        product.prices.push(...pricesToUpdate); // This adds the new prices
        product.trackedAt = new Date(); // Update the trackedAt for the product
        await product.save();
      }
    } else {
      // If product does not exist, create a new product entry with the fetched prices
      product = new Product({
        id: productId,
        prices: fetchedPrices.prices
      });
      await product.save();
    }

    // Respond with the latest prices
    res.json(product);
  } catch (error) {
    console.error(`Error fetching prices for product ${productId}: ${error}`);
    res.status(500).send('Error fetching product prices');
  }
};
