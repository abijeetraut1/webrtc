import express from "express";
import { getAuthenticated, resendOTP, verifyOTP } from "../controller/auth.controller";
const router = express.Router();

router.post("/get-authenticated", getAuthenticated);
router.post("/otp-verification", verifyOTP);
router.post("/resend-otp-verification", resendOTP);

export default router;