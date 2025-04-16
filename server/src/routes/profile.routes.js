import { addProfile, getProfile, updateProfile, faceRegister } from "../controllers/profile.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/addProfile").post(upload.single("image"),addProfile);
router.route("/getProfile").get(getProfile);
router.route("/updateProfile").put(updateProfile);
router.route("/faceregister").patch(faceRegister);

export default router;