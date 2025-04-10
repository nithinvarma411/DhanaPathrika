import {Router} from 'express';
import { sendMessage } from '../controllers/twilio.controller.js';

const router = Router();

router.route("/sendtwilio").post(sendMessage);

export default router;