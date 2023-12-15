import Product from "../models/productModel.js";
import {
  fetchProductPrices,
  fetchProductSpecs,
  searchProductsService,
  getProductIDService
} from "../services/meliService.js";
import { isPriceDifferent } from "../utils/priceUtils.js";

export const getProductPrices = async (req, res) => {
  const { productId } = req.params;

  try {
    const fetchedPrices = await fetchProductPrices(productId);
    let product = await Product.findOne({ id: productId });

    if (product) {
      // Determine if there are new or different prices to update
      const pricesToUpdate = fetchedPrices.prices.filter((fetchedPrice) => {
        const lastPrice = product.prices
          .slice() // Create a copy to avoid mutating the original array
          .sort((a, b) => new Date(b.trackedAt) - new Date(a.trackedAt)) // Sort by trackedAt descending
          .find((p) => p.type === fetchedPrice.type); // Find the latest price of the same type

        // If there is no last price recorded, or the amounts are different, consider it updated
        return !lastPrice || isPriceDifferent(fetchedPrice, lastPrice);
      });

      if (pricesToUpdate.length > 0) {
        // Update the product's prices if there are changes
        await Product.findOneAndUpdate(
          { id: productId },
          {
            $push: { prices: { $each: pricesToUpdate } },
            $set: { trackedAt: new Date() },
          },
          { new: true }
        );
      }
    } else {
      // If product does not exist, create a new product entry with the fetched prices
      product = new Product({
        id: productId,
        prices: fetchedPrices.prices,
      });
      await product.save();
    }

    res.json(product.prices);
  } catch (error) {
    console.error(`Error fetching prices for product ${productId}: ${error}`);
    res.status(500).send("Error fetching product prices");
  }
};

export const getProductSpecs = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await fetchProductSpecs(productId);
    const prices = await fetchProductPrices(productId)
    const extraData = await getProductIDService(productId)
    const specs = product[0].body.attributes;
    const transformedSpecs = specs.map((spec) => ({
      spec: spec.name,
      value: spec.value_name,
    }));
    const data = {
      prices: prices,
      specs:transformedSpecs,
      title:extraData.title,
      url:extraData.permalink,
      store: "Mercado Libre"

    }
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching specs for product ${productId}: ${error}`);
    res.status(500).send("Error fetching product specs");
  }
};

export const searchProducts = async (req,res,next) => {
  const {searchString} = req.params
  try {
    const searchResults = await searchProductsService(searchString)
    res.status(200).json(searchResults)
  } catch (error) {
    console.error(`Error searching with search string ${searchString}: ${error}`);
    res.status(500).send("Error searching products");
  }
}

export const getProductID = async (req,res,next) => {
  const {productId} = req.params
  try {
    const identifier = await getProductIDService(productId)
    console.log(`data from product ${productId} sended to client`)
    res.status(200).json(identifier)
  } catch (error) {
    console.error(`Error getting product id ${productId}: ${error}`);
    res.status(500).send("Error getting ID");
  }
}