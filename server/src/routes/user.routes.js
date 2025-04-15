import {register, login, logout, faceLogin} from '../controllers/user.controller.js';
import {Router} from 'express';

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/facelogin").post(faceLogin);

export default router;