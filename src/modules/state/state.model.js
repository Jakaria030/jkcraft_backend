import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
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
        undoStack: [
            { type: mongoose.Schema.Types.Mixed }
        ],
        redoStack: [
            { type: mongoose.Schema.Types.Mixed }
        ],
    },
    {
        timestamps: true,
    },
);

const State = mongoose.model("State", stateSchema);

export default State;