import { createInvoice, getInvoices, updateInvoice, deleteInvoice, getLatestInvoice, sendInvoiceEmail } from "../controllers/invoice.controller.js";
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

const createInvoiceLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many Invoices generated. Try again later.'
        });
      }
});

const getInvoicesLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

const updateInvoicesLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

const deleteInvoicesLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

const latestInvoicesLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

const sendEmailLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }
});

router.route("/createInvoice").post(createInvoiceLimiter, createInvoice);
router.route("/getInvoices").get(getInvoicesLimiter, getInvoices);
router.route("/updateInvoice/:id").put(updateInvoicesLimiter,updateInvoice);
router.route("/deleteInvoice/:id").delete(deleteInvoicesLimiter, deleteInvoice);
router.route("/latest-invoice").get(latestInvoicesLimiter, getLatestInvoice);
router.route("/send-email").post(sendEmailLimiter, sendInvoiceEmail);

export default router;