import express from 'express';
const router = express.Router();
import { createInternalUser, getInternalUsers } from '../controllers/internaluserController.js';

router.route('/').post(createInternalUser).get(getInternalUsers);

export default router;