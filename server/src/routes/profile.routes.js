import { addProfile, getProfile, updateProfile } from "../controllers/profile.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/addProfile").post(upload.single("image"),addProfile);
router.route("/getProfile").get(getProfile);
router.route("/updateProfile").put(updateProfile);

export default router;