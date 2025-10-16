import { Router } from 'express';
import { createAttendance, listAttendance, updateAttendance, deleteAttendance, attendanceSummary } from '../controllers/attendanceController.js';
const r = Router();
r.get('/', listAttendance);
r.get('/summary', attendanceSummary);
r.post('/', createAttendance);
r.put('/:id', updateAttendance);
r.delete('/:id', deleteAttendance);
export default r;