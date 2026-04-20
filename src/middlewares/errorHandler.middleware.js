import ApiError from "../utils/ApiError.js";

const errorHandler = (err, _req, res, _next) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
};

export default errorHandler;