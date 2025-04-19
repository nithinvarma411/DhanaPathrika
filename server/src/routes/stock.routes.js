import { addStock, getStock, updateStock, deleteStock, getStockByGroup, createGroup, deleteGroup, removeFromGroup, stockSuggestions } from "../controllers/stock.controller.js";
import {Router} from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const addStockLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

const getStockLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

router.route("/addStock").post(addStockLimiter, addStock);
router.route("/getStock").get(getStockLimiter, getStock);
router.route("/getStockByGroup/:group").get(getStockByGroup);
router.route("/createGroup").post(createGroup);
router.route("/update/:id").put(updateStock);
router.route("/delete/:id").delete(deleteStock);
router.route("/deleteGroup").post(deleteGroup);
router.route("/removeFromGroup").put(removeFromGroup);
router.route("/suggestions").get(stockSuggestions)

export default router;