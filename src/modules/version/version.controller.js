import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Project from "../project/project.model.js";
import Publish from "../publish/publish.model.js";
import State from "../state/state.model.js";
import Version from "./version.model.js";

export const createVersion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const version = await Version.findById(id);
    if (!version) {
        throw new ApiError(404, "Version not found");
    }

    const projectId = version.projectId;
    const gjsData = version.gjsData;

    await Publish.deleteOne({ projectId });

    const project = await Project.findById(projectId);
    const url = `${req.user.email}/v${version.versionNo}/${project.slug}`;

    const publish = await Publish.create({
        projectId,
        gjsData,
        url,
    });

    project.publishedVersionId = publish._id;
    await project.save();

    const versionNo = await Version.countDocuments({ projectId });

    const newVersion = await Version.create({
        projectId,
        versionNo: versionNo + 1,
        gjsData,
    });

    await State.create(
        {
            projectId,
            versionId: newVersion._id,
            undoStack: [gjsData],
            redoStack: [],
        },
    );

    res.status(201).json(new ApiResponse(201, "Version created successfully!", newVersion));
});

export const getCurrentVersionProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project is not found");
    }

    const version = await Version.findById(project.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Current Version project not found");
    }

    const state = await State.findOne({
        projectId: projectId,
        versionId: project.currentVersionId,
    });

    return res.status(200).json(
        new ApiResponse(200, "Fetcht successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});

export const updateCurrentVersionProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { gjsData } = req.body;

    if (!gjsData) {
        throw new ApiError(400, "gjsData is required!");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project is not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Current Version project not found");
    }

    let state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });

    if (!state) {
        state = await State.create({
            projectId: version.projectId,
            versionId: version._id,
            undoStack: [gjsData],
            redoStack: [],
        });
    }


    state.undoStack.push(gjsData);

    if (state.undoStack.length > 20) {
        state.undoStack = state.undoStack.slice(-20);
    }

    state.redoStack = [];

    await state.save();


    version.gjsData = gjsData;
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Updated successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});

export const updateTheme = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { theme } = req.body;

    if (!theme) {
        throw new ApiError(400, "theme data is required!");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project is not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Current Version project not found");
    }

    const state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });

    state.undoStack.pop();
    await state.save();

    version.theme = theme;
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Updated successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});

export const updateFonts = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { font } = req.body;

    if (!font) {
        throw new ApiError(400, "font data is required!");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project is not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Current Version project not found");
    }

    const state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });


    version.fonts.push(font);
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Updated successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});

export const updateSEO = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { seo } = req.body;

    if (!seo) {
        throw new ApiError(400, "seo data is required!");
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project is not found");
    }

    const version = await Version.findById(project?.currentVersionId);

    if (!version) {
        throw new ApiError(404, "Current Version project not found");
    }

    const state = await State.findOne({
        projectId: version.projectId,
        versionId: version._id,
    });


    version.seo.push(seo);
    await version.save();

    return res.status(200).json(
        new ApiResponse(200, "Updated successfully.", {
            ...version.toObject(),
            hasUndo: state?.undoStack?.length > 1,
            hasRedo: state?.redoStack?.length > 0,
        })
    );
});