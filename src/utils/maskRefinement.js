export const refineMask = (maskData, threshold = 0.5) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply threshold to make mask more defined
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3] / 255;
        data[i + 3] = alpha > threshold ? 255 : 0;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = reject;
    img.src = maskData;
  });
};
