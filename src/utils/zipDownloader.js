import JSZip from "jszip";

/**
 * Normalizes Google Drive and other cloud image links into high-res direct download links
 */
export const normalizeImageUrl = (url) => {
  if (!url) return "";
  const str = String(url).trim();

  const matchd = str.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchd && matchd[1]) return `https://lh3.googleusercontent.com/d/${matchd[1]}`;

  const matchid = str.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchid && matchid[1]) return `https://lh3.googleusercontent.com/d/${matchid[1]}`;

  return str;
};

/**
 * Fetches an image and returns it as a Blob or ArrayBuffer with multiple CORS fallbacks
 */
export const fetchImageBlob = async (url, apiBase = "") => {
  const directUrl = normalizeImageUrl(url);

  // 1. Direct fetch
  try {
    const res = await fetch(directUrl, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      if (blob && blob.size > 100) return blob;
    }
  } catch (err) {
    // Continue to proxy fallback
  }

  // 2. Backend Proxy Fallback (Bypasses any cross-origin restrictions)
  if (apiBase) {
    try {
      const proxyUrl = `${apiBase}/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const blob = await res.blob();
        if (blob && blob.size > 100) return blob;
      }
    } catch (err) {
      // Continue to canvas fallback
    }
  }

  // 3. HTML5 Image + Canvas Fallback
  return new Promise((resolve, reject) => {
    try {
      const img = (typeof document !== "undefined" && document.createElement)
        ? document.createElement("img")
        : (typeof Image !== "undefined" ? new Image() : null);

      if (!img) {
        reject(new Error("Image element not supported in this environment"));
        return;
      }

      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          if (typeof document === "undefined" || !document.createElement) {
            reject(new Error("Document canvas unavailable"));
            return;
          }
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width || 1200;
          canvas.height = img.naturalHeight || img.height || 800;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context unavailable"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Canvas blob conversion failed"));
            },
            "image/jpeg",
            0.95
          );
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${directUrl}`));
      img.src = directUrl;
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Packages all selected photos into a single zip archive and triggers download
 */
export const downloadPhotosAsZip = async ({
  photos = [],
  galleryName = "Dreamwed_Wedding",
  groomName = "",
  brideName = "",
  apiBase = "",
  onProgress = () => {}
}) => {
  if (!photos || photos.length === 0) {
    throw new Error("No photos provided to download");
  }

  const zip = new JSZip();
  
  // Construct clean folder name
  const coupleName = groomName && brideName
    ? `${groomName}_and_${brideName}`.replace(/[^a-zA-Z0-9_-]/g, "_")
    : galleryName.replace(/[^a-zA-Z0-9_-]/g, "_");

  const folderName = `${coupleName}_Selected_Photos`;
  const folder = zip.folder(folderName);

  const total = photos.length;
  let completed = 0;

  onProgress({
    current: 0,
    total,
    percent: 0,
    status: `Preparing ${total} selected photos for compression...`
  });

  // Download all photos concurrently in small batches of 3
  const batchSize = 3;
  for (let i = 0; i < total; i += batchSize) {
    const batch = photos.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (photo, batchIdx) => {
        const idx = i + batchIdx;
        const fileName = `Photo_${String(idx + 1).padStart(2, "0")}.jpg`;
        try {
          onProgress({
            current: completed,
            total,
            percent: Math.round((completed / total) * 90),
            status: `Downloading & packaging photo ${idx + 1} of ${total}...`
          });
          const blob = await fetchImageBlob(photo.url, apiBase);
          folder.file(fileName, blob);
        } catch (err) {
          console.warn(`Failed to package ${fileName}:`, err);
        } finally {
          completed++;
        }
      })
    );
  }

  onProgress({
    current: total,
    total,
    percent: 92,
    status: "Compressing into high-speed ZIP archive..."
  });

  const zipBlob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      onProgress({
        current: total,
        total,
        percent: 92 + Math.round(metadata.percent * 0.08),
        status: `Generating ZIP: ${Math.round(metadata.percent)}% complete...`
      });
    }
  );

  onProgress({
    current: total,
    total,
    percent: 100,
    status: "Starting ZIP download..."
  });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 10000);

  return { success: true, fileName: `${folderName}.zip` };
};
