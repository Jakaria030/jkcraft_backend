import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Project from "../project/project.model.js";
import Version from "../version/version.model.js";
import State from "./state.model.js";

export const redoVersionProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });

    if (!state) {
        throw new ApiError(404, "State not found");
    }

    if (!state.redoStack.length) {
        throw new ApiError(400, "Nothing to redo");
    }

    const redoData = state.redoStack.pop();

    state.undoStack.push(redoData);

    if (state.undoStack.length > 20) {
        state.undoStack = state.undoStack.slice(-20);
    }

    version.gjsData = redoData;

    await state.save();
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Redo successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});

export const undoVersionProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });

    if (!state) {
        throw new ApiError(404, "State not found");
    }

    if (state.undoStack.length <= 1) {
        throw new ApiError(400, "Nothing to undo");
    }

    const undoData = state.undoStack.pop();

    state.redoStack.push(undoData);

    if (state.redoStack.length > 20) {
        state.redoStack = state.redoStack.slice(-20);
    }

    version.gjsData = state.undoStack[state.undoStack.length - 1];

    await state.save();
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Undo successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});