import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Publish from "./publish.model.js";

export const publishProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const publish = await Publish.findById(id);
    if (!publish) {
        throw new ApiError(404, "Publish project not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Publish project fetch successfully", publish)
    )
});