import { processImageWithMask, createMaskFromObjects } from '../utils/imageProcessor';
import { refineMask } from '../utils/maskRefinement';
import { removeBackground } from './backgroundRemoval';

const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;

export const processImage = async (file, quality) => {
  try {
    const base64Image = await fileToBase64(file);
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image.split(',')[1] },
          features: [{ type: 'OBJECT_LOCALIZATION', maxResults: 20 }]
        }]
      })
    });

    if (!response.ok) throw new Error('API request failed');
    const result = await response.json();
    
    if (!result.responses?.[0]?.localizedObjectAnnotations?.length) {
      throw new Error('No objects detected');
    }

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = base64Image;
    });

    const processedImage = await removeBackground(
      img,
      result.responses[0].localizedObjectAnnotations,
      quality
    );

    return { processedImage };
  } catch (error) {
    console.error('Error:', error);
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
