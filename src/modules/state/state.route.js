import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import { redoVersionProject, undoVersionProject } from "./state.controller.js";


const router = Router();

router.put("/redo/:id", verifyToken, redoVersionProject);
router.put("/undo/:id", verifyToken, undoVersionProject);

export default router;