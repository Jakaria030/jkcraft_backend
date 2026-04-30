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
            required: true,
        },
        gjsData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        theme: {
            type: mongoose.Schema.Types.Mixed,
        },
        fonts: {
            type: [String],
            default: [],
        },
        seo: {
            type: [],
            default: [],
        }
    },
    {
        timestamps: true,
    },
);

const Version = mongoose.model("Version", versionSchema);

export default Version;