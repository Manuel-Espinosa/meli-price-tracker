import express from 'express';
import { getProductPrices, getProductSpecs } from '../controllers/productController.js';

const router = express.Router();

router.get('/:productId/prices', getProductPrices);
router.get('/:productId/specs', getProductSpecs);

export default router;
