import Attendance from '../models/Attendance.js';
import InternalUser from '../models/InternalUser.js';

export const markAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const attendance = new Attendance({ userId, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAttendanceRecord = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const user = await InternalUser.findOne({
        $or: [{ name: new RegExp(search, 'i') }, { phoneNumber: search }]
      });
      if (user) query.userId = user._id;
    }
    const attendance = await Attendance.find(query).populate('userId', 'name phoneNumber role');
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendancePercentage = async (req, res) => {
  try {
    const { search } = req.query;
    let user;
    if (search) {
      user = await InternalUser.findOne({
        $or: [{ name: new RegExp(search, 'i') }, { phoneNumber: search }, { _id: search }]
      });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    const totalDays = await Attendance.countDocuments({ userId: user._id });
    const presentDays = await Attendance.countDocuments({ userId: user._id, status: 'present' });
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({ userId: user._id, name: user.name, percentage: Number(percentage.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};