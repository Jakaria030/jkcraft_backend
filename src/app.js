import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Import routes
import userRoutes from "./modules/user/user.route.js";


app.use("/api/users", userRoutes);

// Health check route
app.get("/", (_req, res) => {
    res.send("JKCraft backend is running!");
});

// Global error handler
app.use(errorHandler);

export default app;