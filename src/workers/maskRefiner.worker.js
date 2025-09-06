/* eslint-disable no-restricted-globals */
// src/workers/maskRefiner.worker.js

/**
 * Refines a mask image by applying a threshold to its alpha channel.
 * Operates within a Web Worker context.
 * @param {string} maskData - Data URL of the mask image.
 * @param {number} threshold - Alpha threshold (0-1). Pixels below this are made fully transparent.
 * @returns {Promise<string>} - Data URL of the refined mask image.
 */
async function refineMaskWorker(maskData, threshold) {
  try {
    // Fetch the image data and create an ImageBitmap
    const response = await fetch(maskData);
    if (!response.ok) {
      throw new Error(`Failed to fetch mask data: ${response.statusText}`);
    }
    const blob = await response.blob();
    const imgBitmap = await createImageBitmap(blob);

    // Create an OffscreenCanvas
    const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get OffscreenCanvas context");
    }

    // Draw the image bitmap onto the canvas
    ctx.drawImage(imgBitmap, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply threshold to the alpha channel
    for (let i = 0; i < data.length; i += 4) {
      // Assuming mask is grayscale, use any channel (e.g., red) for luminance
      const luminance = data[i] / 255;
      // Adjust the alpha channel based on threshold
      data[i + 3] = luminance > threshold ? 255 : 0;
    }

    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    // Convert the canvas back to a Blob, then to Data URL
    const refinedBlob = await canvas.convertToBlob({ type: "image/png" });
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(refinedBlob);
    });
  } catch (error) {
    console.error("Error in mask refinement worker:", error);
    throw error; // Re-throw to be caught by the onerror handler
  }
}

// Listen for messages from the main thread
self.onmessage = async (event) => {
  const { maskDataUrl, threshold } = event.data;

  if (!maskDataUrl || threshold === undefined) {
    self.postMessage({
      error: "Missing maskDataUrl or threshold in worker message",
    });
    return;
  }

  try {
    const refinedMaskDataUrl = await refineMaskWorker(maskDataUrl, threshold);
    // Send the result back to the main thread
    self.postMessage({ refinedMaskDataUrl });
  } catch (error) {
    // Send error back to the main thread
    self.postMessage({
      error: error.message || "Unknown error during refinement",
    });
  }
};
