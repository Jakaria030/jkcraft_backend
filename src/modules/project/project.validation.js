import mongoose from "mongoose";
import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    projectType: z.enum(["template", "project"]).optional(),
    templateId: z.string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid ObjectId",
        }),
});

export const updateProjectSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").optional()
});

export const updateThumbnailSchema = z.object({
    thumbnail: z.string().url("Thumbnail must be a valid URL")
});

export const updateSlugSchema = z.object({
    slug: z.string().min(3, "Slug must be at least 3 characters").max(100, "Slug is too long").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
});