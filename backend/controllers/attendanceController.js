import Attendance from '../models/Attendance.js';

export const createAttendance = async (req, res) => {
  try {
    const att = await Attendance.create(req.body);
    // IMPROVEMENT: Populate the user for the newly created record
    const populatedAtt = await Attendance.findById(att._id).populate('user');
    res.status(201).json(populatedAtt);
  } catch(e){ res.status(400).json({ error: e.message }); }
};

export const listAttendance = async (req, res) => {
  const { user, month } = req.query;
  const filter = {};
  if(user) filter.user = user;
  if(month){
    const m = new Date(month+"-01");
    const end = new Date(m); end.setMonth(end.getMonth()+1);
    filter.date = { $gte: m, $lt: end };
  }
  const data = await Attendance.find(filter).populate('user').sort({ date:-1 });
  res.json(data);
};

export const updateAttendance = async (req, res) => {
  try{
    const att = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!att) return res.status(404).json({ error: 'Not found' });
    // IMPROVEMENT: Populate the user on update as well
    const populatedAtt = await Attendance.findById(att._id).populate('user');
    res.json(populatedAtt);
  } catch(e){ res.status(400).json({ error: e.message }); }
};

export const deleteAttendance = async (req, res) => {
  await Attendance.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};

export const attendanceSummary = async (req, res) => {
  // FIX: Allow querying by 'month' from req.query
  const { month } = req.query;

  let start, end;

  if (month) {
    // Calculate start and end dates based on the provided month (YYYY-MM)
    const m = new Date(month + "-01");
    start = m;
    end = new Date(m);
    end.setMonth(end.getMonth() + 1);
  } else {
    // Fallback to the current month if no month is provided
    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth()+1, 1);
  }

  // simple monthly summary counts by status
  const pipeline = [
    // Use the calculated start/end dates in the match stage
    { $match: { date: { $gte: start, $lt: end } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ];
  const summary = await Attendance.aggregate(pipeline);
  // Return the month that was summarized
  res.json({ month: start.toISOString().slice(0,7), summary });
};