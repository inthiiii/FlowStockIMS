// models/InternalUser.js
import mongoose from 'mongoose';
import Counter from './Counter.js'; // Import the new counter model

const InternalUserSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true, // This constraint is crucial
  },
  name: {
    type: String,
    required: [true, 'Full Name is required.'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters.'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    match: [/^\d{9}$/, 'Phone number must be exactly 9 digits.'],
  },
  address: {
    type: String,
    required: [true, 'Address is required.'],
    trim: true,
    minlength: [10, 'Address must be at least 10 characters long.'],
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff', 'peon', 'delivery_staff', 'other'],
    default: 'staff',
  },
  email: { type: String, lowercase: true, trim: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });


// Auto-generate employeeId using the robust counter method
InternalUserSchema.pre('save', async function(next) {
  if (this.isNew) { // Only generate ID for new documents
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'employeeId' }, // The ID of our counter document
        { $inc: { seq: 1 } },   // Atomically increment the sequence
        { new: true, upsert: true } // Return the new value, and create if it doesn't exist
      );
      this.employeeId = `EMP${String(counter.seq).padStart(4, '0')}`;
      next();
    } catch (error) {
      // If there's an error during ID generation, pass it to the error handler
      return next(error);
    }
  }
  next();
});

export default mongoose.model('InternalUser', InternalUserSchema);