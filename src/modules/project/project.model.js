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
            default: "",
        },
        projectType: {
            type: String,
            enum: ["project", "template"],
            default: "project",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
    }
);

projectSchema.index({ userId: 1, url: 1 }, { unique: true });

const Project = mongoose.model("Project", projectSchema);

export default Project;