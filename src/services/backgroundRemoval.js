const createMaskFromObjects = (objects, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Fill with black (transparent)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Draw objects in white (visible)
  ctx.fillStyle = 'white';
  objects.forEach(obj => {
    const vertices = obj.boundingPoly.normalizedVertices;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x * width, vertices[0].y * height);
    vertices.forEach((vertex, i) => {
      if (i > 0) ctx.lineTo(vertex.x * width, vertex.y * height);
    });
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
