// routes/summarization.route.js
import express from "express";
import {
  summarizePDF,
  getSummarizationHistory,
} from "../controllers/summarization.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const summarizationRouter = express.Router();

summarizationRouter.post("/", protectRoute, summarizePDF);
summarizationRouter.get("/", protectRoute, getSummarizationHistory);

export default summarizationRouter;