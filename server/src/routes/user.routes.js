import {register, login, logout} from '../controllers/user.controller.js';
import {Router} from 'express';

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;