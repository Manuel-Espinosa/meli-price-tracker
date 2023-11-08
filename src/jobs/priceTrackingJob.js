import cron from 'node-cron';
import Product from '../models/productModel';
import fetchProductPrices from '../services/meliService';

cron.schedule('0 */6 * * *', async (productId) => { // Runs every 6 hours
  const productId = productId;
  try {
    const pricesData = await fetchProductPrices(productId);
    await Product.findOneAndUpdate(
      { id: productId },
      { 
        $push: { prices: { $each: pricesData.prices } },
        $set: { trackedAt: new Date() }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Updated prices for product ${productId}`);
  } catch (error) {
    console.error(`Failed to update prices for product ${productId}: ${error}`);
  }
});
