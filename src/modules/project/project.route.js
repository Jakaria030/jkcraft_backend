import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createProject, deleteProject, getProjects, getTemplatesInfo, updateProject, updateSlug, updateThumbnail } from "./project.controller.js";
import { createProjectSchema, updateProjectSchema, updateSlugSchema, updateThumbnailSchema } from "./project.validation.js";

const router = Router();

router.post("/", validate(createProjectSchema), verifyToken, createProject);

router.put("/:projectId", validate(updateProjectSchema), verifyToken, updateProject);
router.put("/:projectId/thumbnail", validate(updateThumbnailSchema), verifyToken, updateThumbnail);
router.put("/:projectId/slug", validate(updateSlugSchema), verifyToken, updateSlug);

router.get("/templates", verifyToken, getTemplatesInfo);
router.get("/", verifyToken, getProjects);

router.delete("/:id", verifyToken, deleteProject);


export default router;