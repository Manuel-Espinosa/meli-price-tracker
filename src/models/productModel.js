import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  id: String,
  type: String,
  amount: Number,
  regular_amount: Number,
  currency_id: String,
  last_updated: Date,
  conditions: {
    context_restrictions: [String],
    start_time: Date,
    end_time: Date
  }
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  prices: [priceSchema],
  registeredAt: { type: Date, default: Date.now },
  trackedAt: Date
});

const Product = mongoose.model('Product', productSchema);

export default Product;
