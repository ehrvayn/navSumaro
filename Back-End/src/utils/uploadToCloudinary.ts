import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error("CLOUDINARY ERROR:", error);
          reject(error);
        } else if (!result) {
          reject(new Error("No result from Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(buffer);
  });
};