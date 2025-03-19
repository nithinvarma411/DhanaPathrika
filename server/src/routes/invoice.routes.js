import { createInvoice, getInvoices, updateInvoice, deleteInvoice } from "../controllers/invoice.controller.js";
import { Router } from 'express';

const router = Router();

router.route("/createInvoice").post(createInvoice);
router.route("/getInvoices").get(getInvoices);
router.route("/updateInvoice/:id").put(updateInvoice);
router.route("/deleteInvoice/:id").delete(deleteInvoice);

export default router;