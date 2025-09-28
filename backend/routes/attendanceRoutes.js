import express from 'express';
const router = express.Router();
import { markAttendance, getAttendanceRecord, getAttendancePercentage } from '../controllers/attendanceController.js';

router.route('/mark').post(markAttendance);
router.route('/record').get(getAttendanceRecord);
router.route('/percentage').get(getAttendancePercentage);

export default router;