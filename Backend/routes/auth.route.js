import express from "express";
import {login, logout, signup, sendVerifyOtp, verifyEmail,  sendRestPasswordOtp, resetPassword, newPassword} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-email", userAuth, verifyEmail);

router.post("/send-reset-otp", sendRestPasswordOtp);
router.post("/reset-password", resetPassword);
router.post("/new-password", newPassword);


export default router;

