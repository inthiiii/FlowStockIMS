// models/Counter.js
import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// This ensures there's only one 'counter' document to increment
CounterSchema.index({ _id: 1, seq: 1 }, { unique: true });

export default mongoose.model('Counter', CounterSchema);