import { Router } from 'express';
import {forgotPassword, verifyOTP, resetPassword} from '../controllers/resetpass.controller.js';

const router = Router();

router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyotp").post(verifyOTP);
router.route("/resetpass").post(resetPassword);

export default router;