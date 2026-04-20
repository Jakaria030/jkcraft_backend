import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import User from "./user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = await generateTokens(user._id);

    res.status(201).json(
        new ApiResponse(201, "User registered successfully", {
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    );
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPassworValid = await user.comparePassword(password);
    if (!isPassworValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateTokens(user._id);

    res.status(200).json(
        new ApiResponse(200, "Login successful", {
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
    );
});

export const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

    res.status(200).json(
        new ApiResponse(200, "Logout successful", null)
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    res.status(200).json(
        new ApiResponse(200, "Access token refreshed", {
            accessToken,
            refreshToken: newRefreshToken,
        })
    );
});

export const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, "Profile fetched successfully", req.user)
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name },
        { new: true }
    ).select("-password -refreshToken -__v -createdAt -updatedAt");

    res.status(200).json(
        new ApiResponse(200, "Profile updated successfully", user)
    );
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, "Password changed successfully", null)
    );
});