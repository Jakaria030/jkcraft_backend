import { deleteFromCloudinary } from "../../config/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { generateSlug } from "../../utils/generateSlug.js";
import File from "../file/file.model.js";
import Publish from "../publish/publish.model.js";
import State from "../state/state.model.js";
import Version from "../version/version.model.js";
import Project from "./project.model.js";


export const createProject = asyncHandler(async (req, res) => {
    const { name, description, projectType, templateId } = req.body;

    const template = await Version.findOne({ _id: templateId }).select("projectId gjsData");

    if (!template) {
        throw new ApiError(404, "Template is not found.");
    }

    const newCreatedProject = await Project.create(
        {
            name,
            description,
            projectType,
            userId: req.user._id,
            slug: generateSlug(name),
        },
    );

    const newCreatedVersion = await Version.create(
        {
            projectId: newCreatedProject._id,
            versionNo: 1,
            gjsData: template.gjsData
        },
    );

    newCreatedProject.currentVersionId = newCreatedVersion._id;
    await newCreatedProject.save();

    await State.create(
        {
            projectId: newCreatedProject._id,
            versionId: newCreatedVersion._id,
            undoStack: [],
            redoStack: [],
        },
    );

    res.status(201).json(
        new ApiResponse(201, "Project created successfully", newCreatedProject)
    );
});

export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.name = name;

    if (description !== undefined) {
        project.description = description;
    }

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, "Project updated successfully", project)
    );
});

export const updateThumbnail = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { thumbnail } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    project.thumbnail = thumbnail;

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, "Thumbnail updated successfully", project)
    );
});

export const updateSlug = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { slug } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const existingProject = await Project.findOne({
        userId,
        slug,
    });

    if (existingProject) {
        throw new ApiError(400, "Slug already exists. Try another one.");
    }

    project.slug = slug;

    await project.save();

    return res.status(200).json(
        new ApiResponse(200, "Slug updated successfully", project)
    );
});

export const getTemplatesInfo = asyncHandler(async (req, res) => {

    const templates = await Project.find({ projectType: "template" }).select("_id name thumbnail currentVersionId");

    return res.status(200).json(
        new ApiResponse(200, "Templates info fetch successfully", templates)
    );
});

export const getProjects = asyncHandler(async (req, res) => {

    const projects = await Project.find({ userId: req.user._id }).lean();

    const versionIds = projects.map(project => project.currentVersionId).filter(Boolean);

    const versions = await Version.find({
        _id: { $in: versionIds }
    }).select("updatedAt").lean();

    const versionMap = {};
    versions.forEach(v => {
        versionMap[v._id.toString()] = v.updatedAt;
    });

    const modifiedProjects = projects.map(project => ({
        ...project,
        updatedAt: project.currentVersionId
            ? versionMap[project.currentVersionId.toString()] || null
            : null
    }));

    return res.status(200).json(
        new ApiResponse(200, "Projects fetch successfully", modifiedProjects)
    );
});

export const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // 1. find all files
    const files = await File.find({ projectId: id });

    // 2. delete from Cloudinary

    await Promise.all(
        files.map(file => deleteFromCloudinary(file.url))
    );

    // 3. delete files from DB
    await File.deleteMany({ projectId: id });

    // 4. delete versions
    await Version.deleteMany({ projectId: id });

    // 5. Delete states
    await State.deleteMany({ projectId: id });

    // 6. Delete published project
    await Publish.deleteOne({ projectId: id });

    // 7. delete project
    await Project.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, "Project deleted successfully")
    );
});