import mongoose from 'mongoose';

const priceTrackerSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PriceTracker = mongoose.model('PriceTracker', priceTrackerSchema);

export default PriceTracker;
