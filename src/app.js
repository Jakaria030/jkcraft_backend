import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Import routes
import userRoutes from "./modules/user/user.route.js";
import projectRoutes from "./modules/project/project.route.js";

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Health check route
app.get("/", (_req, res) => {
    res.send("JKCraft backend is running!");
});

// Global error handler
app.use(errorHandler);

export default app;