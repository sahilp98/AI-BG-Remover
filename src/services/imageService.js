import { processImageWithMask, createMaskFromObjects } from '../utils/imageProcessor';
import { refineMask } from '../utils/maskRefinement';

const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

export const processImage = async (file, quality) => {
  try {
    const base64Image = await fileToBase64(file);
    console.log('Sending image to Vision API...');
    
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1]
          },
          features: [{
            type: 'OBJECT_LOCALIZATION',
            maxResults: 20  // Increased for better detection
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Vision API Response:', result);

    if (!result.responses?.[0]?.localizedObjectAnnotations) {
      throw new Error('No objects detected in the image');
    }

    const objects = result.responses[0].localizedObjectAnnotations;
    console.log('Detected objects:', objects);

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = base64Image;
    });

    const maskCanvas = createMaskFromObjects(img.width, img.height, objects);
    const maskDataUrl = maskCanvas.toDataURL('image/png');
    const refinedMask = await refineMask(maskDataUrl, quality / 100);
    
    return {
      mask: refinedMask
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

export const finalizeImage = async (originalImage, maskDataUrl, quality) => {
  try {
    const processedImage = await processImageWithMask(originalImage, maskDataUrl);
    return processedImage;
  } catch (error) {
    console.error('Error finalizing image:', error);
    throw error;
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
