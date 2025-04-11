import { Router } from "express";
import { verifyOTP, sendotp } from "../controllers/verify.controller.js";

const router = Router();

router.route("/sendotp").post(sendotp);
router.route("/verifyotp").post(verifyOTP);

export default router;