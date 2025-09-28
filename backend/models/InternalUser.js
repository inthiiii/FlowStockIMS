import mongoose from 'mongoose';

const internalUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['manager', 'staff', 'peon', 'delivery_staff', 'other'], required: true },
  createdAt: { type: Date, default: Date.now }
});

const InternalUser = mongoose.model('InternalUser', internalUserSchema);
export default InternalUser;