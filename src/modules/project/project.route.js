import { Router } from "express";
import { createProject } from "./project.controller.js";
import verifyToken from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createProject);

export default router;