export const createMaskFromObjects = (width, height, objects) => {
  if (!Array.isArray(objects) || objects.length === 0) {
    console.error('No objects detected in the image');
    throw new Error('No objects detected in the image');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Start with black background (this will be transparent)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Draw detected objects in white (this will be visible)
  ctx.fillStyle = 'white';
  objects.forEach(obj => {
    if (!obj.boundingPoly || !obj.boundingPoly.normalizedVertices) {
      console.warn('Invalid object structure:', obj);
      return;
    }

    const vertices = obj.boundingPoly.normalizedVertices;
    if (vertices.length < 3) return;

    // Draw the object with anti-aliasing
    ctx.beginPath();
    ctx.moveTo(vertices[0].x * width, vertices[0].y * height);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x * width, vertices[i].y * height);
    }
    ctx.closePath();
    ctx.fill();

    // Log object detection
    console.log('Drawing object:', obj.name, 'at vertices:', vertices);
  });

  return canvas;
};

export const processImageWithMask = async (originalImage, maskDataUrl) => {
  return new Promise((resolve, reject) => {
    const originalImg = new Image();
    const maskImg = new Image();
    
    let originalLoaded = false;
    let maskLoaded = false;

    const tryProcess = () => {
      if (!originalLoaded || !maskLoaded) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw original image
        ctx.drawImage(originalImg, 0, 0);
        
        // Set composition mode to use mask
        ctx.globalCompositeOperation = 'destination-in';
        
        // Draw mask (white areas will be kept, black will be transparent)
        ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height);

        console.log('Processing complete - mask applied');
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('Error in image processing:', error);
        reject(error);
      }
    };

    originalImg.onload = () => {
      console.log('Original image loaded');
      originalLoaded = true;
      tryProcess();
    };

    maskImg.onload = () => {
      console.log('Mask image loaded');
      maskLoaded = true;
      tryProcess();
    };

    originalImg.onerror = () => reject(new Error('Failed to load original image'));
    maskImg.onerror = () => reject(new Error('Failed to load mask image'));

    originalImg.src = originalImage;
    maskImg.src = maskDataUrl;
  });
};
