import express from 'express';
import productRoutes from './productRoutes.js'

const router = express.Router();

router.use('/product', productRoutes);


export default router;
