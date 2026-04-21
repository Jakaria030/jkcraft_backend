import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        versionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Version",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const File = mongoose.model("File", fileSchema);

export default File;