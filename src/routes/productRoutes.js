import express from "express";
import {
  getProductPrices,
  getProductSpecs,
  searchProducts,
  getProductID
} from "../controllers/productController.js";

const router = express.Router();

router.get("/:productId/prices", getProductPrices);
router.get("/:productId/identifier", getProductID);
router.get("/:productId/specs", getProductSpecs);
router.get("/search/:searchString", searchProducts);


export default router;
