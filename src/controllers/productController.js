import Product from '../models/productModel.js';
import fetchProductPrices from '../services/meliService.js';

export const getProductPrices = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product already exists in the database
    let product = await Product.findOne({ id: productId });

    // Fetch the latest prices from MELI API
    const pricesData = await fetchProductPrices(productId);

    if (product) {
      // If product exists, update the prices and the trackedAt field
      product.prices.push(...pricesData.prices);
      product.trackedAt = new Date();
      await product.save();
    } else {
      // If product does not exist, create a new product entry with the prices
      product = await Product.create({
        id: productId,
        prices: pricesData.prices,
        trackedAt: new Date(),
      });
    }

    // Respond with the latest prices
    res.json(product.prices);
  } catch (error) {
    console.error(`Error fetching prices for product ${productId}: ${error}`);
    res.status(500).send('Error fetching product prices');
  }
};
