import axios from "axios";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Google Cloud API key is missing - check environment variables"
  );
}
const API_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";

/**
 * Analyzes an image using Google Cloud Vision API for object localization
 * @param {File} imageFile - The image file to analyze
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Promise<Object>} - The API response with object localization data
 */
export const analyzeImage = async (imageFile, maxResults = 20) => {
  try {
    const base64Image = await fileToBase64(imageFile);

    if (!base64Image.includes(",")) {
      throw new Error("Invalid base64 image format");
    }

    const dimensions = await getImageDimensions(base64Image);

    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image.split(",")[1],
          },
          features: [
            {
              type: "OBJECT_LOCALIZATION",
              maxResults,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${API_ENDPOINT}?key=${API_KEY}`,
      requestBody
    );
    const [result] = response.data.responses;

    if (!result.localizedObjectAnnotations) {
      throw new Error("No objects detected in the image");
    }

    return {
      objects: result.localizedObjectAnnotations,
      imageWidth: dimensions.width,
      imageHeight: dimensions.height,
    };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      `Vision API failed: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

/**
 * Gets the dimensions of an image from its base64 representation
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
const getImageDimensions = (base64Image) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.src = base64Image;
  });
};
