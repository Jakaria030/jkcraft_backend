import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import { redoVersionProject, undoVersionProject } from "./state.controller.js";


const router = Router();

router.put("/redo/:projectId", verifyToken, redoVersionProject);
router.put("/undo/:projectId", verifyToken, undoVersionProject);

export default router;