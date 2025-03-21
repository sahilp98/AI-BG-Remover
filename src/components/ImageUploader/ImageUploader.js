import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

function ImageUploader({ onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  return (
    <div className="uploader-container">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <p>{isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}</p>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
