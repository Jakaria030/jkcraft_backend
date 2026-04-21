import mongoose from "mongoose";

const publishSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true,
        },
        gjsData: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        url: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

const Publish = mongoose.model("Publish", publishSchema);

export default Publish;