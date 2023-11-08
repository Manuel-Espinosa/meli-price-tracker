import mongoose from 'mongoose';

const DB_CONTAINER_NAME = process.env.DB_CONTAINER_NAME;
const DB_PORT = process.env.DB_CONTAINER_PORT;
const DB_NAME = process.env.DB_NAME;

const MONGO_URI = `mongodb://${DB_CONTAINER_NAME}:${DB_PORT}/${DB_NAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected using URI: ${MONGO_URI}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
