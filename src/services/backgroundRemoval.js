const createMaskFromObjects = (objects, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fill with black (transparent)
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // Draw objects with full opacity
  ctx.fillStyle = 'rgba(255, 255, 255, 1)';
  objects.forEach(obj => {
    const vertices = obj.segmentation?.normalizedVertices || obj.boundingPoly.normalizedVertices;
    if (!vertices || vertices.length < 3) {
      console.warn('Invalid object segmentation data:', obj);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(vertices[0].x * width, vertices[0].y * height);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x * width, vertices[i].y * height);
    }
    ctx.closePath();
    ctx.fill();
  });

  return canvas;
};

export const removeBackground = async (imageElement, objects, quality = 80) => {
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');

  // Draw original image
  ctx.drawImage(imageElement, 0, 0);

  // Create and apply mask
  const mask = createMaskFromObjects(objects, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(mask, 0, 0);

  return canvas.toDataURL('image/png');
};
