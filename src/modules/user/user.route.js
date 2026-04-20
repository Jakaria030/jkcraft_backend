import { Router } from "express";
import { changePasswordSchema, loginSchema, registerSchema, updateProfileSchema } from "./user.validation.js";
import validate from "../../middlewares/validate.js";
import { changePassword, getProfile, login, logout, refreshAccessToken, register, updateProfile } from "./user.controller.js";
import verifyToken from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyToken, logout);
router.post("/refresh-token", refreshAccessToken);

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, validate(updateProfileSchema), updateProfile);
router.put("/change-password", validate(changePasswordSchema), verifyToken, changePassword);


export default router;