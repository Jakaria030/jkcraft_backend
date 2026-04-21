import { deleteFromCloudinary, uploadToCloudinary } from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import deleteLocalFile from "../../utils/deleteLocalFile.js";
import Project from "../project/project.model.js";
import Version from "../version/version.model.js";
import File from "./file.model.js";


export const createFile = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const project = await Project.findOne({ _id: projectId });

    if (!project) {
        deleteLocalFile(req.file.path);
        throw new ApiError(404, "Project not found");
    }

    try {
        const url = await uploadToCloudinary(req.file.path);
        deleteLocalFile(req.file.path);

        const file = await File.create({
            projectId,
            versionId: project.currentVersionId,
            name: req.file.originalname,
            url,
        });

        res.status(201).json(
            new ApiResponse(201, "File uploaded successfully", file)
        );
    } catch (error) {
        deleteLocalFile(req.file.path);
        throw new ApiError(500, "File upload failed");
    }
});

export const getFiles = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project Id is not correct");
    }

    const files = await find({ projectId, versionId: project.currentVersionId });

    res.status(200).json(
        new ApiResponse(200, "File fetch successfully!", files)
    );
});


export const deleteFile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) {
        throw new ApiError(404, "File not found!");
    }

    await deleteFromCloudinary(file.url);
    await File.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, "File deleted!", null)
    )
});