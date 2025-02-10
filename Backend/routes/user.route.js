import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getUserData } from "../controllers/user.controller.js";
import { getPublicKey } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserData);
userRouter.get("/public-key/:userId", protectRoute, getPublicKey);

export default userRouter;