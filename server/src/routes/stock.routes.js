import { addStock, getStock, updateStock, deleteStock, getStockByGroup, createGroup, deleteGroup, removeFromGroup, stockSuggestions } from "../controllers/stock.controller.js";
import {Router} from 'express';

const router = Router();

router.route("/addStock").post(addStock);
router.route("/getStock").get(getStock);
router.route("/getStockByGroup/:group").get(getStockByGroup);
router.route("/createGroup").post(createGroup);
router.route("/update/:id").put(updateStock);
router.route("/delete/:id").delete(deleteStock);
router.route("/deleteGroup").post(deleteGroup);
router.route("/removeFromGroup").put(removeFromGroup);
router.route("/suggestions").get(stockSuggestions)

export default router;