import {
  processImageWithMask,
  createMaskFromObjects,
} from "../utils/imageProcessor";
import { removeBackground } from "./backgroundRemoval";
import { analyzeImage } from "./visionApi";

// Function to call the mask refinement worker
const refineMaskWithWorker = (maskDataUrl, threshold) => {
  return new Promise((resolve, reject) => {
    // Create a new worker instance.
    // Note: This assumes your build setup (like Create React App with react-app-rewired or Craco)
    // handles worker loading correctly. You might need specific configuration.
    const worker = new Worker(
      new URL("../workers/maskRefiner.worker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      if (event.data.error) {
        console.error("Worker Error:", event.data.error);
        reject(new Error(event.data.error));
      } else {
        resolve(event.data.refinedMaskDataUrl);
      }
      worker.terminate(); // Clean up the worker once done
    };

    worker.onerror = (error) => {
      console.error("Worker onerror:", error);
      reject(error);
      worker.terminate(); // Clean up on error too
    };

    // Send data to the worker
    worker.postMessage({ maskDataUrl, threshold });
  });
};

export const processImage = async (file, quality) => {
  try {
    // Convert file to data URL for display
    const originalImageUrl = URL.createObjectURL(file);

    // Analyze image with Google Cloud Vision API, getting dimensions
    const { objects, imageWidth, imageHeight } = await analyzeImage(file);

    if (!objects || objects.length === 0) {
      throw new Error("No objects detected in the image");
    }

    // Create mask using dimensions from analyzeImage
    const mask = createMaskFromObjects(imageWidth, imageHeight, objects);
    const maskDataUrl = mask.toDataURL("image/png");

    // Apply quality/threshold adjustments using the worker
    const refinedMask =
      quality < 100
        ? await refineMaskWithWorker(maskDataUrl, quality / 100)
        : maskDataUrl;

    return {
      mask: refinedMask,
      originalImageUrl,
    };
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

/**
 * Applies the mask to the original image to create the final transparent PNG
 * @param {string} originalImage - URL of the original image
 * @param {string} maskDataUrl - Data URL of the mask image
 * @returns {Promise<string>} - Data URL of the processed image
 */
export const finalizeImage = async (originalImage, maskDataUrl) => {
  try {
    // Process the image with the mask to create the final transparent PNG
    const processedImage = await processImageWithMask(
      originalImage,
      maskDataUrl
    );
    return processedImage;
  } catch (error) {
    console.error("Error finalizing image:", error);
    throw error;
  }
};
