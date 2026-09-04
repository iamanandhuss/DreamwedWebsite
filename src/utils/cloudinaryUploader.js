/**
 * Frontend Cloudinary Upload Service for Dreamwed Stories
 * Direct browser uploads to high-speed Cloudinary CDN
 */

const CLOUD_NAME = "jisf5zce";
const UPLOAD_PRESET = "dreamwed_preset";

export const uploadImageToCloudinary = async (fileOrBlob, onProgress = null) => {
  if (!fileOrBlob) throw new Error("No file provided for upload");

  const formData = new FormData();
  formData.append("file", fileOrBlob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "dreamwed_website");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          const autoUrl = res.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
          resolve({
            id: res.public_id,
            url: autoUrl,
            rawUrl: res.secure_url,
            format: res.format,
            width: res.width,
            height: res.height,
            bytes: res.bytes,
            created_at: res.created_at
          });
        } catch (e) {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes.error?.message || "Cloudinary upload failed"));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.send(formData);
  });
};
