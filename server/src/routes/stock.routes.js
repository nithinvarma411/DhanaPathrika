import { addStock, getStock, updateStock, deleteStock } from "../controllers/stock.controller.js";
import {Router} from 'express';

const router = Router();

router.route("/addStock").post(addStock);
router.route("/getStock").get(getStock);
router.route("/update/:id").put(updateStock);
router.route("/delete/:id").delete(deleteStock);

export default router;