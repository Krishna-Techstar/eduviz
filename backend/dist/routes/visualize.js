import { Router } from "express";
import { visualizeHandler } from "../controllers/visualizeController.js";
export const visualizeRouter = Router();
visualizeRouter.post("/", visualizeHandler);
//# sourceMappingURL=visualize.js.map