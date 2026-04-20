import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Health check route
app.get("/", (_req, res) => {
    res.send("JKCraft backend is running!");
});

// Global error handler
app.use(errorHandler);

export default app;