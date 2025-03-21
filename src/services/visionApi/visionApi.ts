import axios from 'axios';

const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

export const analyzeImage = async (imageFile: File) => {
  try {
    const base64Image = await fileToBase64(imageFile);
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image.split(',')[1]
          },
          features: [
            {
              type: 'OBJECT_LOCALIZATION',
              maxResults: 10
            }
          ]
        }
      ]
    };

    const response = await axios.post(
      `${API_ENDPOINT}?key=${API_KEY}`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
