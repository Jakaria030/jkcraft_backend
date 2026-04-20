import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            rquired: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        thumbnail: {
            type: String,
        },
        projectType: {
            type: String,
            enum: ["project", "template"],
            default: "project",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        currentVersionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Version",
            default: null,
        },
        publishedVersionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Version",
            default: null,
        },
        slug: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;