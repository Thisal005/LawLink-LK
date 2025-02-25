import express from "express";
import userAuth from "../middleware/userAuth.js";
import { createCase } from "../controllers/case.controller.js";


const caseRouter = express.Router();

caseRouter.post("/create-case", createCase);

export default caseRouter;