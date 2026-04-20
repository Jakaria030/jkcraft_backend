import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath, fileType) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: "jkcraft",
        resource_type: "auto",
    });

    return result.secure_url;
};

export const deleteFromCloudinary = async (url) => {
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];
  const publicId = `jkcraft/${filename.split(".")[0]}`;

  const resourceType = url.includes("/video/") ? "video" : "image";

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};