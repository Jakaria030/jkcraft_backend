import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { generateSlug } from "../../utils/generateSlug.js";
import State from "../state/state.model.js";
import Version from "../version/version.model.js";
import Project from "./project.model.js";


export const createProject = asyncHandler(async (req, res) => {
    const { name, description, gjsData, projectType } = req.body;

    if (!name || !gjsData) {
        throw new ApiError(400, "name and gjsData is required");
    }

    const project = await Project.create(
        {
            name,
            description,
            projectType,
            userId: req.user._id,
            slug: generateSlug(name),
        },
    );

    const version = await Version.create(
        {
            projectId: project._id,
            versionNo: 1,
            gjsData,
        },
    );

    project.currentVersionId = version._id;
    await project.save();

    await State.create(
        {
            projectId: project._id,
            versionId: version._id,
            undoStack: [],
            redoStack: [],
        },
    );

    res.status(201).json(
        new ApiResponse(201, "Project created successfully", project)
    );
});
