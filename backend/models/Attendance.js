import mongoose from 'mongoose';
const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'InternalUser', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present','Absent','Leave','Half-day','Work From Home'], default: 'Present' },
  checkIn: { type: String },
  checkOut: { type: String },
  notes: { type: String }
}, { timestamps: true });

AttendanceSchema.index({ user:1, date:1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);