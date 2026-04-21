import { Router } from "express";
import verifyToken from "../../middlewares/auth.middleware.js";
import { createFile, getFiles, deleteFile } from "./file.controller.js";
import upload from "../../middlewares/multer.middleware.js";

const router = Router();

router.post("/:projectId", verifyToken, upload.single("file"), createFile);
router.get("/:projectId", verifyToken, getFiles);
router.delete("/:id", verifyToken, deleteFile);

export default router;