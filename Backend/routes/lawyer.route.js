import express from "express";
import lawyerAuth from "../middleware/lawyerAuth.js";
import { getLawyerData } from "../controllers/lawyer.controller.js";

const lawyerRouter = express.Router();

lawyerRouter.get('/data', lawyerAuth, getLawyerData);

export default lawyerRouter;