import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import { publishProject } from "./publish.controller.js";

const router = Router();

router.get("/:id", verifyToken, publishProject);

export default router;