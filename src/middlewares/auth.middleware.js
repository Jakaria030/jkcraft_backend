import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../modules/user/user.model.js";

const verifyToken = asyncHandler(async (req, _res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized - No token provided");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken -__v -createdAt -updatedAt");

    if (!user) {
        throw new ApiError(401, "Unauthorized - User not found");
    }

    req.user = user;
    next();
});


export default verifyToken;