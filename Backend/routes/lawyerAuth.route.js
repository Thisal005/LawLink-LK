import express from "express";
import userAuth from "../middleware/userAuth.js";
import { signup, login, logout, sendVerifyOtp, verifyEmail, sendRestPasswordOtp, resetPassword, newPassword } from "../controllers/lawyerauth.controller.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-email", userAuth, verifyEmail);

router.post("/send-reset-otp", sendRestPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/new-password", newPassword);

export default router;