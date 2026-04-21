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
import versionRoutes from "./modules/version/version.route.js";
import stateRoutes from "./modules/state/state.route.js";
import publishRoutes from "./modules/publish/publish.route.js";
import fileRoutes from "./modules/file/file.route.js";

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/publishes", publishRoutes);
app.use("/api/files", fileRoutes);

// Health check route
app.get("/", (_req, res) => {
    res.send("JKCraft backend is running!");
});

// Global error handler
app.use(errorHandler);

export default app;