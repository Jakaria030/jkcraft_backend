import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import { createVersion, getCurrentVersionProject, updateCurrentVersionProject } from "./version.controller.js";


const router = Router();

router.post("/:id", verifyToken, createVersion);
router.get("/:projectId", verifyToken, getCurrentVersionProject);
router.put("/:id", verifyToken, updateCurrentVersionProject);

export default router;