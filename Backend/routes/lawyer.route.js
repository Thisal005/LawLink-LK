import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getLawyerData } from "../controllers/lawyer.controller.js";

const lawyerRouter = express.Router();

lawyerRouter.get('/data', userAuth, getLawyerData);

export default lawyerRouter;