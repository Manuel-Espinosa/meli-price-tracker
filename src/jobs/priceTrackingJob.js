import cron from "node-cron";
import Product from "../models/productModel.js";
import {fetchProductPrices} from "../services/meliService.js";
import { isPriceDifferent } from "../utils/priceUtils.js";

//0 */6 * * * runs every 6 hours
const startPriceTrackingJob = () => {
  cron.schedule("0 */6 * * * ", async () => {
    // Runs every 6 hours
    console.log("Starting the scheduled price update job...");
    try {
      // Fetch all products from the database
      const products = await Product.find({});

      console.log(
        `Found ${products.length} products to check for price updates.`
      );

      for (const product of products) {
        console.log(`Fetching prices for product ID: ${product.id}`);
        const pricesData = await fetchProductPrices(product.id);

        // Determine if there are new or different prices to update
        const pricesToUpdate = pricesData.prices.filter((fetchedPrice) => {
          const lastPrice = product.prices.find(
            (p) => p.type === fetchedPrice.type
          );
          return !lastPrice || isPriceDifferent(fetchedPrice, lastPrice);
        });

        if (pricesToUpdate.length > 0) {
          console.log(
            `Updating prices for product ID: ${product.id} with new prices: `
          );
          await Product.findOneAndUpdate(
            { id: product.id },
            {
              $push: { prices: { $each: pricesToUpdate } },
              $set: { trackedAt: new Date() },
            },
            { new: true }
          );
          console.log(`Successfully updated prices for product ${product.id}`);
        } else {
          console.log(
            `No price change detected for product ID: ${product.id}. No update necessary.`
          );
        }
      }
    } catch (error) {
      console.error(`An error occurred during the price update job: ${error}`);
    }
  });
};

export default startPriceTrackingJob