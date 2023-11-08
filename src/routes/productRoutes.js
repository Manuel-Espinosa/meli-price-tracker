import express from 'express';
import { getProductPrices } from '../controllers/productController.js';

const router = express.Router();

router.get('/:productId/prices', getProductPrices);

export default router;
