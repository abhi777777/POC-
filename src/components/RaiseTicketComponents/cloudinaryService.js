// services/cloudinaryService.js

/**
 * Creates and initializes a Cloudinary upload widget
 * @param {Function} onSuccess - Callback function on successful upload
 * @param {Function} onError - Callback function on upload error
 * @returns {Object} - The Cloudinary widget instance
 */
export const createUploadWidget = (onSuccess, onError) => {
  if (typeof window === "undefined" || !window.cloudinary) {
    console.error("Cloudinary not loaded");
    return null;
  }

  return window.cloudinary.createUploadWidget(
    {
      cloudName: "dhnd7arvq",
      uploadPreset: "ml_default",
      resourceType: "raw",
      multiple: false,
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary error", error);
        if (onError) onError(error);
        return;
      }

      if (result.event === "success" && onSuccess) {
        console.log("Upload success", result.info.secure_url);
        onSuccess(result.info.secure_url);
      }
    }
  );
};

export default { createUploadWidget };
