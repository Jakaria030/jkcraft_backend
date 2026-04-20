import mongoose from "mongoose";

const versionSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        versionNo: {
            type: Number,
            default: 1,
        },
        gjsData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Version = mongoose.model("Version", versionSchema);

export default Version;