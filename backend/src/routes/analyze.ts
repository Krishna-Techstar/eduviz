import { Router } from "express";
import { analyzeCodeHandler } from "../controllers/analyzeController.js";

export const analyzeRouter = Router();

analyzeRouter.post("/", analyzeCodeHandler);
