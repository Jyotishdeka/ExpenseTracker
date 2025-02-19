import { Router } from "express";
import { verifyJwt } from "../middleware/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";


const router = Router();


// router.route("/").get(verifyJwt, getAllTransactions);
router.route("/create-transaction").post(verifyJwt, createTransaction);


export default router;
