import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createProject, deleteProject, getProjects, getTemplatesInfo, updateProject, updateThumbnail } from "./project.controller.js";
import { createProjectSchema, updateProjectSchema } from "./project.validation.js";
import upload from "../../middlewares/multer.middleware.js";

const router = Router();

router.post("/", validate(createProjectSchema), verifyToken, createProject);

router.put("/:projectId", validate(updateProjectSchema), verifyToken, updateProject);
router.put("/:projectId/thumbnail", verifyToken, upload.single("file"), updateThumbnail);

router.get("/templates", verifyToken, getTemplatesInfo);
router.get("/", verifyToken, getProjects);

router.delete("/:id", verifyToken, deleteProject);


export default router;