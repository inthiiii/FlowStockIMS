import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      'MongoDB Connection Failed: Missing MONGO_URI (or MONGODB_URI) in environment.'
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // modern defaults; mongoose ignores unknown options in newer versions
      autoIndex: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;